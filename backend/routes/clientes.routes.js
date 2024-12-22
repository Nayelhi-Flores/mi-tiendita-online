const express = require('express');
const router = express.Router();
const { validarToken, validarRol } = require('../middlewares/auth');
const { 
    getClientes, 
    getCliente, 
    createCliente, 
    updateCliente 
} = require('../controllers/clientes.controllers');

router.get('/clientes', validarToken, validarRol(1), getClientes);

router.get('/cliente/:idClientes', validarToken, getCliente);

router.post('/cliente', validarToken, validarRol(1), createCliente);

router.put('/cliente/:idClientes', validarToken, updateCliente);

module.exports = router;