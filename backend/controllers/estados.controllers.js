const sequelize = require('../sequelize');
const { manejarError } = require('../helpers/errores');
const { convertToInteger } = require('../helpers/validaciones');

// Obtener todos los estados
const getEstados = async (req, res) => {
    try {
        const [estados] = await sequelize.query('SELECT * FROM Estados;'); 
        res.json(estados);
    } catch (error) {
        manejarError(res, error, 'Error al obtener los estados');
    }
};

// Obetener un estado por ID
const getEstado = async (req, res) => {
    const { idEstado } = req.params;
    try {
        const estado = await sequelize.query(
            'EXEC sp_ConsultarEstadoPorId @idEstados = :idEstado;',
            {
                replacements: { idEstado: convertToInteger(idEstado) },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (estado.length > 0) {
            res.json(estado[0]);
        } else {
            res.status(404).json({ message: 'Estado no encontrado' });
        }
    } catch (error) {
        manejarError(res, error, 'Error al obtener el estado');
    }
};

// Crear un estado
const createEstado = async (req, res) => {
    const { nombre } = req.body;

    // Validar datos requeridos
    if (!nombre) {
        return res.status(400).json({ error: 'El nombre es obligatorio para crear un estado' });
    }

    try {
        await sequelize.query(
            'EXEC sp_InsertarEstados @nombre = :nombre;',
            {
                replacements: { nombre: nombre },
            }
        );
        res.status(201).json({ message: 'Estado creado exitosamente'});
    } catch (error) {
        manejarError(res, error, 'Error al crear el estado');
    }
};

// Actualizar un estado
const updateEstado = async (req, res) => {
    const { idEstado } = req.params;
    const { nombre} = req.body;

    try {
        await sequelize.query(
            `EXEC sp_ActualizarEstados
                @idEstados = :idEstado,
                @nombre = :nombre;`,
            {
                replacements: {
                    idEstado: convertToInteger(idEstado),
                    nombre: nombre || null
                },
            }
        );
        res.status(201).json({ message: 'Estado actualizado exitosamente' });
    } catch (error) {
        manejarError(res, error, 'Error al actualizar el estado');
    }
};

// Eliminar un estado
const deleteEstado = async (req, res) => {
    const { idEstado } = req.params;

    try {
        await sequelize.query(
            'EXEC sp_EliminarEstado @idEstados = :idEstado;',
            {
                replacements: { idEstado: convertToInteger(idEstado) },
            }
        );
        res.status(201).json({ message: 'Estado eliminado exitosamente' });
    } catch (error) {
        manejarError(res, error, 'Error al eliminar el estado');
    }
};

module.exports = { 
    getEstados, 
    getEstado, 
    createEstado, 
    updateEstado, 
    deleteEstado
};