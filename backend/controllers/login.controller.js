const sequelize = require('../sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { rol, correo, password } = req.body

    // Validar los campos
    if (!rol || !correo || !password) {
        return res.status(400).json({ error: 'Por favor, debe llenar todos los campos solicitados' });
    }

    try {
        const usuario = await sequelize.query(
            'SELECT * FROM Usuarios WHERE correo_electronico = :correo;',
            {
                replacements:{
                    correo: correo
                },
                type: sequelize.QueryTypes.SELECT
            }
        );

        // Verificar si el correo esta registrado
        if (!usuario) {
            return res.status(404).json({ error: 'Correo no registrado' });
        }

        // Validar el rol del usuario
        if (usuario[0].rol_idRol !== parseInt(rol, 10)) {
            return res.status(403).json({ error: 'Rol no autorizado' });
        }

        // Validar contraseña
        const esPasswordValido = await bcrypt.compare(password, usuario[0].password);
        if (!esPasswordValido) {
            return res.status(403).json({ error: 'Contraseña incorrecta' });
        }

        // Crear un token JWT para la sesión
        const token = jwt.sign(
            {
                idUsuario: usuario[0].idUsuarios,
                rol: usuario[0].rol_idRol
            },
            process.env.JWT_SECRET || 'secret_key', // Clave secreta
            { expiresIn: process.env.JWT_EXPIRATION || '24h' } // Expiración
        );
        
        // Guardar el token en la cookie
        res.cookie('auth_token', token, {
            httpOnly: true, // Solo accesible desde el servidor
            secure: process.env.NODE_ENV === 'production', // Solo usa HTTPS en producción
            sameSite: 'strict', // Previene el envío de cookies en solicitudes cruzadas
            maxAge: 1000 * 60 * 60 * 24,
        });

        res.status(200).json({
            message: 'Inicio de sesión exitoso'
        });
        
    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ error: 'Error en el servidor al iniciar sesión' });
    }
};

const logout = (req, res) => {
    res.clearCookie('auth_token'); // Elimina la cookie
    res.json({ mensaje: 'Sesión cerrada exitosamente' });
}

module.exports = { 
    login,
    logout
};