const express = require('express');
const router = express.Router();
const { validarToken, validarRol } = require('../middlewares/auth');
const { 
    getUsuarios, 
    getUsuario, 
    createUsuario,
    actualizarPassword, 
    updateUsuario,
    setUsuarioInactivo 
} = require('../controllers/usuarios.controllers');
const ROLES = require('../helpers/roles');

router.get('/usuarios', validarToken, validarRol(ROLES.OPERADOR), getUsuarios);

router.get('/usuario/:idUsuario', validarToken, validarRol(ROLES.OPERADOR), getUsuario);
router.get('/usuario', validarToken, getUsuario);

router.post('/usuario', validarToken, validarRol(ROLES.OPERADOR), createUsuario);

router.put('/usuario/:idUsuario', validarToken, updateUsuario);

router.put('/deshabilitar/usuario/:idUsuario', validarToken, validarRol(ROLES.OPERADOR), setUsuarioInactivo);

router.put('/actualizar-password/usuario/:idUsuario', validarToken, actualizarPassword);

module.exports = router;