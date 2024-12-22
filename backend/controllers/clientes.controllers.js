const sequelize = require('../sequelize');

// Función auxiliar para manejar errores
const manejarError = (res, error, message) => {
    console.error(message, error);
    res.status(500).json({ error: message });
};

// Obtener todos los clientes
const getClientes = async (req, res) => {
    try {
        const [clientes] = await sequelize.query('SELECT * FROM Clientes;');
        res.json(clientes);
    } catch (error) {
        manejarError(res, error, 'Error al obtener los clientes');
    }
};

// Obtener un cliente por ID
const getCliente = async (req, res) => {
    const { idClientes } = req.params;
    try {
        const id = parseInt(idClientes, 10); // Convertir ID a entero

        const cliente = await sequelize.query(
            'EXEC sp_ConsultarClientePorId @idClientes = :idClientes;',
            {
                replacements: { idClientes: id },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (cliente.length > 0) {
            res.json(cliente[0]);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        manejarError(res, error, 'Error al obtener el cliente');
    }
};

// Crear un cliente
const createCliente = async (req, res) => {
    const { razon_social, nombre_comercial, nit, direccion_entrega, telefono, correo } = req.body;

    // Validar datos requeridos
    if (!nit || !correo) {
        return res.status(400).json({ error: 'Por favor envía todos los datos requeridos (NIT y correo)' });
    }

    try {
        await sequelize.query(
            `EXEC sp_InsertarCliente 
                @razon_social = :razon_social, 
                @nombre_comercial = :nombre_comercial, 
                @nit = :nit, 
                @direccion_entrega = :direccion_entrega, 
                @telefono = :telefono, 
                @correo = :correo;`,
            {
                replacements: { 
                    razon_social: razon_social || null,
                    nombre_comercial: nombre_comercial || null,
                    nit,
                    direccion_entrega: direccion_entrega || null,
                    telefono: telefono || null,
                    correo
                },
            }
        );
        res.status(201).json({ message: 'Cliente creado exitosamente' });
    } catch (error) {
        manejarError(res, error, 'Error al crear el cliente');
    }
};

// Actualizar un cliente
const updateCliente = async (req, res) => {
    const { idClientes } = req.params;
    const { razon_social, nombre_comercial, nit, direccion_entrega, telefono, correo } = req.body;

    try {
        const id = parseInt(idClientes, 10); // Convertir ID a entero

        await sequelize.query(
            `EXEC sp_ActualizarCliente
                @idClientes = :idClientes, 
                @razon_social = :razon_social, 
                @nombre_comercial = :nombre_comercial, 
                @nit = :nit, 
                @direccion_entrega = :direccion_entrega, 
                @telefono = :telefono, 
                @correo = :correo;`,
            {
                replacements: { 
                    idClientes: id,
                    razon_social: razon_social || null,
                    nombre_comercial: nombre_comercial || null,
                    nit: nit || null,
                    direccion_entrega: direccion_entrega || null,
                    telefono: telefono || null,
                    correo: correo || null
                },
            }
        );
        res.status(200).json({ message: 'Cliente actualizado exitosamente' });
    } catch (error) {
        manejarError(res, error, 'Error al actualizar el cliente');
    }
};

module.exports = {
    getClientes,
    getCliente,
    createCliente,
    updateCliente
};