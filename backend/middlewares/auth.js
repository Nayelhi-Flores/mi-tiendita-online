const jwt = require('jsonwebtoken');

const validarToken = (req, res, next) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado, token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.usuario = decoded; // Información del token decodificada
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
};

const validarRol = (rolPermitido) => {
    return (req, res, next) => {
        const { rol } = req.usuario; // El rol viene del token decodificado
        if (rol !== rolPermitido) {
            return res.status(403).json({ error: 'Acceso denegado: no tienes permisos suficientes' });
        }
        next();
    };
};

module.exports = { 
    validarToken,
    validarRol
};