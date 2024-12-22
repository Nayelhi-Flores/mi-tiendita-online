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

router.get('/usuarios', validarToken, validarRol(1), getUsuarios);

router.get('/usuario/:idUsuario', validarToken, getUsuario);

router.post('/usuario', validarToken, validarRol(1), createUsuario);

router.put('/usuario/:idUsuario', validarToken, updateUsuario);

router.put('deshabilitar/usuario/:idUsuario', validarToken, validarRol(1), setUsuarioInactivo);

router.put('/actualizar-password/usuario/:idUsuario', validarToken, actualizarPassword);

module.exports = router;