const sequelize = require('../sequelize');

// Función auxiliar para manejar errores
const manejarError = (res, error, message) => {
    console.error(message, error);
    res.status(500).json({ error: message });
};

// Obtener todas las ordenes
const getOrdenes = async (req, res) => {
    try {
        const [ordenes] = await sequelize.query('SELECT * FROM ConsultarMaestroDetalle;'); 
        res.json(ordenes);
    } catch (error) {
        manejarError(res, error, 'Error al obtener las ordenes');
    }
};

// Obtener una orden por ID
const getOrden = async (req, res) => {
    const { idOrden } = req.params
    try {
        const orden = await sequelize.query(
            'EXEC sp_ConsultarMaestroDetallePorId @idOrden = :idOrden;',
            {
                replacements: {
                    idOrden: idOrden
                },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (orden.length > 0) {
            res.json(orden);
        } else {
            res.status(404).json({ message: 'No se encontro una orden con ese ID' });
        }
    } catch (error) {
        manejarError(res, error, 'Error al obtener la orden');
    }
}

// Crear una orden
const createOrden = async (req, res) => {
    const { usuario, nombre, direccion, telefono, correo, fecha_entrega, detalles } = req.body;

    // Validar datos requeridos
    if (!usuario || !correo || !fecha_entrega || !detalles || !detalles.length) {
        return res.status(400).json({ error: 'Por favor, ingrese todos los datos requeridos para realizar la orden' });
    }

    try {
        const [results] = await sequelize.query(
            `EXEC sp_InsertarOrdenConDetalles
                @usuarios_idUsuarios = :usuario,
                @estados_idEstados = :estado,
                @nombre_completo = :nombre,
                @direccion = :direccion,
                @telefono = :telefono,
                @correo_electronico = :correo,
                @fecha_entrega = :fecha_entrega,
                @detalles = :detalles;`,
            {
                replacements: {
                    usuario: usuario,
                    estado: 4, 
                    nombre: nombre,
                    direccion: direccion || null,
                    telefono: telefono || null,
                    correo: correo,
                    fecha_entrega: fecha_entrega,
                    detalles: JSON.stringify(detalles)
                },
            }
        );
        res.status(201).json({ message: 'Orden realizada exitosamente' });
    } catch (error) {
        manejarError(res, error, 'Error al realizar la orden');
    }
};

// Actualizar una orden
const updateOrden = async (req, res) => {
    const { idOrden } = req.params; // ID de la orden que se actualizará
    const {
        estado,
        nombre,
        direccion,
        telefono,
        correo,
        fecha_entrega,
        detalles,
    } = req.body;

    try {
        const idOrdenInt = parseInt(idOrden, 10); // Convertir ID a entero

        await sequelize.query(
            `EXEC sp_ActualizarOrden
                @idOrden = :idOrden,
                @estados_idEstados = :estado,
                @nombre_completo = :nombre,
                @direccion = :direccion,
                @telefono = :telefono,
                @correo_electronico = :correo,
                @fecha_entrega = :fecha_entrega,
                @detalles = :detalles;`,
            {
                replacements: {
                    idOrden: idOrdenInt,
                    estado: estado || null,
                    nombre: nombre || null,
                    direccion: direccion || null,
                    telefono: telefono || null,
                    correo: correo || null,
                    fecha_entrega: fecha_entrega || null,
                    detalles: detalles ? JSON.stringify(detalles) : null,
                },
            }
        );
        res.status(201).json({ message: 'Orden actualizada exitosamente' });
    } catch (error) {
        manejarError(res, error, 'Error al actualizar la orden');
    }
};

// Cancelar una orden
const cancelarOrden = async (req, res) => {
    const { idOrden } = req.params;

    try {
        const idOrdenInt = parseInt(idOrden, 10); // Convertir ID a entero
        
        await sequelize.query(
            `EXEC sp_CancelarOrden
                @idOrden = :idOrden;`,
            {
                replacements: {
                    idOrden: idOrdenInt
                },
            }
        );
        res.status(201).json({ message: 'Orden cancelada exitosamente' });
    } catch (error) {
        manejarError(res, error, 'Error al intentar cancelar la orden');
    }
};

// Cambiar el estado de una orden
const cambiarEstadoOrden = async (req, res) => {
    const { idOrden } = req.params;
    const { estado } = req.body;

    try {
        await sequelize.query(
            `EXEC sp_ActualizarOrden
                @idOrden = :idOrden,
                @estados_idEstados = :estado;`,
            {
                replacements: {
                    idOrden: idOrden,
                    estado: estado
                },
            }
        );
        res.status(201).json({ message: 'Estado de la orden actualizada exitosamente a ' + estado });
    } catch (error) {
        manejarError(res, error, 'Error al actualizar el estado de la orden');
    }
};

module.exports = { 
    getOrdenes, 
    getOrden, 
    createOrden,
    updateOrden,
    cancelarOrden,
    cambiarEstadoOrden
};