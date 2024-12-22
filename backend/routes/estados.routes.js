const express = require('express');
const router = express.Router();
const { validarToken, validarRol } = require('../middlewares/auth');
const { 
    getEstados, 
    getEstado, 
    createEstado, 
    updateEstado,
    deleteEstado
} = require('../controllers/estados.controllers');

router.get('/estados', validarToken, validarRol(1), getEstados);

router.get('/estado/:idEstado', validarToken, validarRol(1), getEstado);

router.post('/estado', validarToken, validarRol(1), createEstado);

router.put('/estado/:idEstado', validarToken, validarRol(1), updateEstado);

router.delete('/estado/:idEstado', validarToken, validarRol(1), deleteEstado);

module.exports = router;