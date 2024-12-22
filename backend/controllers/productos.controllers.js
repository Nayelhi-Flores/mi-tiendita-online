const sequelize = require('../sequelize');
const multer = require('multer');
const path = require('path');

// Configurar multer
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLocaleLowerCase();
        const extencionesPermitidas = ['.jpg', '.jpeg', '.png'];
        if(!extencionesPermitidas.includes(extension)){
            return cb(new Error('Solo se permiten archivos con extensión .jpg, .jpeg, o .png'));
        }
        cb(null, true);
    }
});

// Función auxiliar para manejar errores
const manejarError = (res, error, message) => {
    console.error(message, error);
    res.status(500).json({ error: message });
};

// Obtener todos los productos
const getProductos = async (req, res) => {
    try {
        const [results] = await sequelize.query('SELECT * FROM Productos'); 
        res.json(results);
    } catch (error) {
        manejarError(res, error, 'Error al obtener los productos');
    }
};

// Obtener productos por filtros
const getProducto = async (req, res) => {
    const {
        idProductos,
        categoria,
        estado,
        nombre,
        marca,
        codigo,
        precioMin,
        precioMax,
        stockMin,
        stockMax,
        ordenarPor,
        orden
    } = req.query;

    try {
        const productos = await sequelize.query(
            `EXEC sp_ConsultarProducto 
                @idProductos = :idProductos,
                @categoria = :categoria,
                @estado = :estado,
                @nombre = :nombre,
                @marca = :marca,
                @codigo = :codigo,
                @precioMin = :precioMin,
                @precioMax = :precioMax,
                @stockMin = :stockMin,
                @stockMax = :stockMax,
                @ordenarPor = :ordenarPor,
                @orden = :orden;`,
            {
                replacements: {
                    idProductos: idProductos || null,
                    categoria: categoria || null,
                    estado: estado || null,
                    nombre: nombre || null,
                    marca: marca || null,
                    codigo: codigo || null,
                    precioMin: precioMin ? parseFloat(precioMin) : null,
                    precioMax: precioMax ? parseFloat(precioMax) : null,
                    stockMin: stockMin ? parseInt(stockMin, 10) : null,
                    stockMax: stockMax ? parseInt(stockMax, 10) : null,
                    ordenarPor: ordenarPor || null, // 'Precio' o 'Stock'
                    orden: orden || 'ASC' // 'ASC' o 'DESC' por defecto
                },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (productos.length > 0) {
            res.json(productos);
        } else {
            res.status(404).json({ message: 'No se encontraron productos con los filtros especificados' });
        }
    } catch (error) {
        manejarError(res, error, 'Error al obtener los productos');
    }
};

// Crear un producto
const createProducto = async (req, res) => {
    // Procesar la imagen
    const uploadSingle = upload.single('foto');
    uploadSingle(req, res, async(error) => {
        if (error) {
            console.error('Error al cargar la imagen:', error);
            return res.status(400).json({ error: error.message });
        }
        
        const { categoriaProductos, usuario, estado, nombre, descripcion, marca, codigo, stock, precio } = req.body;
       
        // Convertir los datos al tipo esperado
        const categoriaProductosId = categoriaProductos ? parseInt(categoriaProductos, 10) : null;
        const usuarioId = usuario ? parseInt(usuario, 10) : null;
        const estadoId = estado ? parseInt(estado, 10) : null;
        const stockInt = stock ? parseInt(stock, 10) : null;
        const precioFloat = precio ? parseFloat(precio) : null;

        // Validar datos requeridos
        if (!nombre || !stock || !precio) {
            return res.status(400).json({ error: 'Por favor envía todos los datos requeridos (nombre, stock y precio)' });
        }

        // Obtener el archivo de la solicitud
        const file = req.file;
        let fotoBinaria = null;

        if (file) {
            try {
                fotoBinaria = file.buffer; // Convertir la imagen a binario
            } catch (error) {
                return res.status(500).json({ error: 'Error al procesar la imagen' });
            }
        }

        try {
            await sequelize.query(
                `EXEC sp_InsertarProducto 
                    @categoriaProductos_idCategoriaProductos = :categoriaProductos, 
                    @usuarios_idUsuarios = :usuario, 
                    @estados_idEstados = :estado, 
                    @nombre = :nombre, 
                    @descripcion = :descripcion, 
                    @marca = :marca,
                    @codigo = :codigo,
                    @stock = :stock,
                    @precio = :precio,
                    @foto = :foto;`,
                {
                    replacements: {
                        categoriaProductos: categoriaProductosId || null,
                        usuario: usuarioId || null,
                        estado: estadoId || null, 
                        nombre: nombre,
                        descripcion: descripcion || null,
                        marca: marca || null,
                        codigo: codigo || null,
                        stock: stockInt,
                        precio: precioFloat,
                        foto: fotoBinaria || null
                    },
                }
            );
            res.status(201).json({ message: 'Producto creado exitosamente'});
        } catch (error) {
            manejarError(res, error, 'Error al crear el producto');
        }
    });
};

// Actualizar un producto
const updateProducto = async (req, res) => {
    const { idProductos } = req.params;
    // Procesar la imagen
    const uploadSingle = upload.single('foto');
    uploadSingle(req, res, async(error) => {
        if (error) {
            console.error('Error al cargar la imagen:', error);
            return res.status(400).json({ error: error.message });
        }

        const { categoriaProductos, usuario, estado, nombre, descripcion, marca, codigo, stock, precio } = req.body;

        try {
            const idProductosInt = parseInt(idProductos, 10); // Convertir ID a entero
            
            // Obtener la foto de la solicitud (si se envió)
            const file = req.file;
            let fotoBinaria = null;

            if (file) {
                try {
                    fotoBinaria = file.buffer; // Convertir la imagen a binario
                } catch (error) {
                    return res.status(500).json({ error: 'Error al procesar la foto' });
                }
            }

            await sequelize.query(
                `EXEC sp_ActualizarProductos
                    @idProductos = :idProductos, 
                    @categoriaProductos_idCategoriaProductos = :categoriaProductos, 
                    @usuarios_idUsuarios = :usuario, 
                    @estados_idEstados = :estado, 
                    @nombre = :nombre, 
                    @descripcion = :descripcion, 
                    @marca = :marca,
                    @codigo = :codigo,
                    @stock = :stock,
                    @precio = :precio,
                    @foto = :foto;`,
                {
                    replacements: {
                        idProductos: idProductosInt,
                        categoriaProductos: categoriaProductos || null,
                        usuario: usuario || null,
                        estado: estado || null, 
                        nombre: nombre || null,
                        descripcion: descripcion || null,
                        marca: marca || null,
                        codigo: codigo || null,
                        stock: stock ? parseInt(stock, 10) : null,
                        precio: precio ? parseFloat(precio) : null,
                        foto: fotoBinaria || null
                    },
                }
            );
            res.status(201).json({ message: 'Producto actualizado exitosamente' });
        } catch (error) {
            manejarError(res, error, 'Error al actualizar el producto');
        }
    });
};

// Cambiar estado del producto a inactivo
const setProductoInactivo = async (req, res) => {
    const { idProductos } = req.params;

    try {
        const idProductosInt = parseInt(idProductos, 10); // Convertir ID a entero
        
        const [results] = await sequelize.query(
            'EXEC sp_CambiarEstadoProducto @idProductos = :idProductos;',
            {
                replacements: { 
                    idProductos: idProductosInt
                },
            }
        );
        res.status(201).json({ message: 'Producto deshabilitado exitosamente'});
    } catch (error) {
        manejarError(res, error, 'Error al deshabilitar el producto');
    }
};

module.exports = { 
    getProductos, 
    getProducto, 
    createProducto, 
    updateProducto, 
    setProductoInactivo 
};