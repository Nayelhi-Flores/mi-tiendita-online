const sequelize = require('../sequelize');
const { manejarError } = require('../helpers/errores');
const { convertToInteger } = require('../helpers/validaciones');
const ROLES = require('../helpers/roles');
const { Sequelize } = require('sequelize');

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
    const { idClientes: paramsIdCliente } = req.params;
    const tokenIdUsuario = req.usuario.idUsuario;
    const tokenRol = req.usuario.rol;

    try {
        let idClientes

        if (tokenRol === ROLES.CLIENTE) {
             // Consultar el ID del cliente asociado al usuario
             const cliente = await sequelize.query(
                'EXEC sp_ObtenerClienteDeUsuario @idUsuario = :idUsuario;',
                {
                    replacements: { idUsuario: tokenIdUsuario },
                    type: sequelize.QueryTypes.SELECT, // Devuelve un arreglo de objetos
                }
            );

            if (cliente.length > 0) {
                idClientes = cliente[0].clientes_idClientes;
            } else {
                return res.status(404).json({ message: 'Cliente no asociado al usuario' });
            }
        } else if (tokenRol === ROLES.OPERADOR) {
            {
                idClientes = paramsIdCliente;
            }
        } else {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        const cliente = await sequelize.query(
            'EXEC sp_ConsultarClientePorId @idClientes = :idClientes;',
            {
                replacements: { idClientes: convertToInteger(idClientes) },
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
                    idClientes: convertToInteger(idClientes),
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