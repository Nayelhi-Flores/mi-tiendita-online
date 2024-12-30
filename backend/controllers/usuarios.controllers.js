const sequelize = require('../sequelize');
const bcrypt = require('bcryptjs');
const manejarError = require('../helpers/errores');
const { convertToInteger } = require('../helpers/validaciones');
const ROLES = require('../helpers/roles');

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    try {
        const [usuarios] = await sequelize.query("SELECT * FROM Usuarios"); 
        res.json(usuarios);
    } catch (error) {
        manejarError(res, error, 'Error al obtener los usuarios');
    }
};

// Obtener un usuario por ID
const getUsuario = async (req, res) => {
    const { idUsuario: paramsIdUsuario } = req.params;
    const tokenIdUsuario = req.usuario.idUsuario;
    const tokenRol = req.usuario.rol;

    try {
        let idUsuario;

        if (tokenRol === ROLES.CLIENTE) {
            idUsuario = tokenIdUsuario;
        } else if (tokenRol === ROLES.OPERADOR) {
            if (!paramsIdUsuario) {
                idUsuario = tokenIdUsuario;
            } else {
                idUsuario = paramsIdUsuario;
            }
        } else {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        const usuario = await sequelize.query(
            'EXEC sp_ConsultarUsuarioPorId @idUsuarios = :idUsuario;',
            {
                replacements: { idUsuario: convertToInteger(idUsuario) },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (usuario.length > 0) {
            res.json(usuario[0]);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        manejarError(res, error, 'Error al obtener el usuario');
    }
};

// Crear un usuario
const createUsuario = async (req, res) => {
    const { rol, estado, cliente, nombre, correo, password, telefono, fecha_nacimiento } = req.body;

    // Validar datos requeridos
    if ( !rol || !nombre || !correo || !password || !fecha_nacimiento) {
        return res.status(400).json({ error: 'Por favor envía todos los datos requeridos' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await sequelize.query(
            `EXEC sp_InsertarUsuario
                @rol_idRol = :rol,
                @estados_idEstados = :estado,
                @clientes_idClientes = :cliente,
                @nombre_completo = :nombre,
                @correo_electronico = :correo,
                @password = :password,
                @telefono = :telefono,
                @fecha_nacimiento = :fecha_nacimiento;`,
            {
                replacements: { 
                    rol: convertToInteger(rol),
                    estado: convertToInteger(estado) || null,
                    cliente: convertToInteger(cliente) || null,
                    nombre: nombre,
                    correo: correo,
                    password: hashedPassword,
                    telefono: telefono || null,
                    fecha_nacimiento: fecha_nacimiento 
                },
            }
        );
        res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (error) {
        manejarError(res, error, 'Error al crear el usuario');
    }
};

// Actualizar la contraseña de un usuario
const actualizarPassword = async (req, res) => {
    const { passwordActual, nuevoPassword } = req.body;

    if (!passwordActual || !nuevoPassword) {
        return res.status(400).json({ error: 'Por favor, envía la contraseña actual y la nueva contraseña' });
    }

    try {
        const idUsuario = req.usuario.idUsuario; // Obtener ID del token

        // Buscar al usuario en la base de datos
        const [usuario] = await sequelize.query(
            'SELECT password FROM Usuarios WHERE idUsuarios = :idUsuario;',
            {
                replacements: { idUsuario: idUsuario },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar que la contraseña actual sea correcta
        const esPasswordValido = await bcrypt.compare(passwordActual, usuario.password);
        if (!esPasswordValido) {
            return res.status(403).json({ error: 'La contraseña actual es incorrecta' });
        }

        // Encriptar la nueva contraseña
        const saltRounds = 10;
        const hashedNuevoPassword = await bcrypt.hash(nuevoPassword, saltRounds);

        // Actualizar la contraseña en la base de datos
        await sequelize.query(
            `EXEC sp_ActualizarUsuario
                @idUsuarios = :idUsuario,
                @password = :nuevoPassword;`,
            {
                replacements: {
                    idUsuario: idUsuario,
                    nuevoPassword: hashedNuevoPassword
                }
            }
        );
        res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        manejarError(res, error, 'Error al actualizar la contraseña');
    }
};

// Actualizar un usuario
const updateUsuario = async (req, res) => {
    const { idUsuario } = req.params;
    const { rol, estado, cliente, nombre, correo, telefono, fecha_nacimiento } = req.body;

    try {
        await sequelize.query(
            `EXEC sp_ActualizarUsuario
                @idUsuarios = :idUsuario,
                @rol_idRol = :rol,
                @estados_idEstados = :estado,
                @clientes_idClientes = :cliente,
                @nombre_completo = :nombre,
                @correo_electronico = :correo,
                @telefono = :telefono,
                @fecha_nacimiento = :fecha_nacimiento;`,
            {
                replacements: {
                    idUsuario: convertToInteger(idUsuario),
                    rol: convertToInteger(rol) || null,
                    estado: convertToInteger(estado) || null,
                    cliente: convertToInteger(cliente) || null,
                    nombre: nombre || null,
                    correo: correo || null,
                    telefono: telefono || null,
                    fecha_nacimiento: fecha_nacimiento || null 
                },
            }
        );
        res.status(201).json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        manejarError(res, error, 'Error al actualizar el usuario');
    }
};

const setUsuarioInactivo = async (req, res) => {
    const { idUsuario } = req.params;

    try {
        await sequelize.query(
            `EXEC sp_ActualizarUsuario
                @idUsuarios = :idUsuario,
                @estados_idEstados = :estado;`,
            {
                replacements: {
                    idUsuario: convertToInteger(idUsuario),
                    estado: 2
                },
            }
        );
        res.status(201).json({ message: 'Usuario deshabilitado exitosamente' });
    } catch (error) {
        manejarError(res, error, 'Error al deshabilitar el usuario');
    }
};

module.exports = { 
    getUsuarios, 
    getUsuario, 
    createUsuario,
    actualizarPassword, 
    updateUsuario,
    setUsuarioInactivo 
};