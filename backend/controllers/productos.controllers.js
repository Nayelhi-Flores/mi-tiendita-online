const sequelize = require('../sequelize');
const multer = require('multer');
const path = require('path');
const { manejarError } = require('../helpers/errores'); 
const { convertToInteger, convertToFloat } = require('../helpers/validaciones');

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
        
        const { 
            categoriaProductos, 
            estado, 
            nombre, 
            descripcion, 
            marca, 
            codigo, 
            stock, 
            precio 
        } = req.body;

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
            const usuario = req.usuario.idUsuario; // Obtener ID del token

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
                        categoriaProductos: convertToInteger(categoriaProductos) || null,
                        usuario: usuario || null,
                        estado: convertToInteger(estado) || null, 
                        nombre: nombre,
                        descripcion: descripcion || null,
                        marca: marca || null,
                        codigo: codigo || null,
                        stock: convertToInteger(stock),
                        precio: convertToFloat(precio),
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

        const { 
            categoriaProductos, 
            estado, 
            nombre, 
            descripcion, 
            marca, 
            codigo, 
            stock, 
            precio 
        } = req.body;

        try {
            const usuario = req.usuario.idUsuario; // Obtener ID del token

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
                        idProductos: convertToInteger(idProductos),
                        categoriaProductos: convertToInteger(categoriaProductos) || null,
                        usuario: usuario || null,
                        estado: convertToInteger(estado) || null, 
                        nombre: nombre || null,
                        descripcion: descripcion || null,
                        marca: marca || null,
                        codigo: codigo || null,
                        stock: convertToInteger(stock) || null,
                        precio: convertToFloat(precio) || null,
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
        const [results] = await sequelize.query(
            'EXEC sp_CambiarEstadoProducto @idProductos = :idProductos;',
            {
                replacements: { 
                    idProductos: convertToInteger(idProductos)
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