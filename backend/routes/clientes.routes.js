const express = require('express');
const router = express.Router();
const { validarToken, validarRol } = require('../middlewares/auth');
const { 
    getClientes, 
    getCliente, 
    createCliente, 
    updateCliente 
} = require('../controllers/clientes.controllers');
const ROLES = require('../helpers/roles');

router.get('/clientes', validarToken, validarRol(ROLES.OPERADOR), getClientes);

router.get('/cliente/:idClientes', validarToken, validarRol(ROLES.OPERADOR), getCliente);
router.get('/cliente', validarToken, validarRol(ROLES.CLIENTE), getCliente);

router.post('/cliente', validarToken, validarRol(ROLES.OPERADOR), createCliente);

router.put('/cliente/:idClientes', validarToken, updateCliente);

module.exports = router;