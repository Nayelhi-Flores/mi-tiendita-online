const sequelize = require('../sequelize');

// Función auxiliar para manejar errores
const manejarError = (res, error, message) => {
    console.error(message, error);
    res.status(500).json({ error: message });
};

// Obtener todas las categorias
const getCategorias = async (req, res) => {
    try {
        const [categorias] = await sequelize.query('SELECT * FROM CategoriaProductos;'); 
        res.json(categorias);
    } catch (error) {
        manejarError(res, error, 'Error al obtener las categorias de los productos');
    }
};

// Obtener una categoria por ID o Estado
const getCategoria = async (req, res) => {
    const { idCategoria, estado } = req.query;
    try {
        const categorias = await sequelize.query(
            `EXEC sp_ConsultarCategoriaProducto
                @idCategoria = :idCategoria,
                @estado = :estado;`,
            {
                replacements: {
                    idCategoria: idCategoria || null,
                    estado: estado || null
                },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (categorias.length > 0) {
            res.json(categorias);
        } else {
            res.status(404).json({ message: 'No se encontraron categorias' });
        }
    } catch (error) {
        manejarError(res, error, 'Error al obtener las categorias de productos');
    }
};

// Crear una categoria
const createCategoria = async (req, res) => {
    const { usuario, estado, nombre } = req.body;

    // Validar datos requeridos
    if (!nombre) {
        return res.status(400).json({ error: 'El nombre es obligatorio para crear una categoria' });
    }

    try {
        await sequelize.query(
            `EXEC sp_InsertarCategoriaProductos
                @usuarios_idUsuarios = :usuario, 
                @estados_idEstados = :estado, 
                @nombre = :nombre;`,
            {
                replacements: {
                    usuario: usuario || null,
                    estado: estado || null, 
                    nombre: nombre
                },
            }
        );
        res.status(201).json({ message: 'Categoria creada exitosamente'});
    } catch (error) {
        manejarError(res, error, 'Error al crear la categoria');
    }
};

// Actualizar una categoria
const updateCategoria = async (req, res) => {
    const { idCategoria } = req.params;
    const { estado, nombre} = req.body;

    try {
        const idCategoriaInt = parseInt(idCategoria, 10); // Convertir ID a entero
        
        await sequelize.query(
            `EXEC sp_ActualizarCategoriaProductos
                @idCategoriaProductos = :idCategoria,
                @estados_idEstados = :estado, 
                @nombre = :nombre;`,
            {
                replacements: {
                    idCategoria: idCategoriaInt,
                    estado: estado || null, 
                    nombre: nombre || null
                },
            }
        );
        res.status(201).json({ message: 'Categoria actualizada exitosamente' });
    } catch (error) {
        manejarError(res, error, 'Error al actualizar la categoria');
    }
};

const setCategoriaInactivo = async (req, res) => {
    const { idCategoria } = req.params;

    try {
        const idCategoriaInt = parseInt(idCategoria, 10); // Convertir ID a entero
        
        await sequelize.query(
            `EXEC sp_ActualizarCategoriaProductos
                @idCategoriaProductos = :idCategoria,
                @estados_idEstados = :estado;`,
            {
                replacements: {
                    idCategoria: idCategoriaInt,
                    estado: 2
                },
            }
        );
        res.status(201).json({ message: 'Categoria deshabilitada exitosamente' });
    } catch (error) {
        manejarError(res, error, 'Error al deshabilitar la categoria');
    }
};

module.exports = { 
    getCategorias, 
    getCategoria, 
    createCategoria, 
    updateCategoria, 
    setCategoriaInactivo
};