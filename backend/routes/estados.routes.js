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
const ROLES = require('../helpers/roles');

router.get('/estados', validarToken, validarRol(ROLES.OPERADOR), getEstados);

router.get('/estado/:idEstado', validarToken, validarRol(ROLES.OPERADOR), getEstado);

router.post('/estado', validarToken, validarRol(ROLES.OPERADOR), createEstado);

router.put('/estado/:idEstado', validarToken, validarRol(ROLES.OPERADOR), updateEstado);

router.delete('/estado/:idEstado', validarToken, validarRol(ROLES.OPERADOR), deleteEstado);

module.exports = router;