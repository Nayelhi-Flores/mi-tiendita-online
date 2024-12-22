const express = require('express');
const router = express.Router();
const { 
    getUsuarios, 
    getUsuario, 
    createUsuario,
    actualizarPassword, 
    updateUsuario,
    setUsuarioInactivo 
} = require('../controllers/usuarios.controllers');

router.get('/usuarios', getUsuarios);

router.get('/usuario/:idUsuario', getUsuario);

router.post('/usuario', createUsuario);

router.put('/usuario/:idUsuario', updateUsuario);

router.put('deshabilitar/usuario/:idUsuario', setUsuarioInactivo);

router.put('/actualizar-password/usuario/:idUsuario', actualizarPassword);

module.exports = router;