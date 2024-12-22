const express = require('express');
const router = express.Router();
const { 
    getClientes, 
    getCliente, 
    createCliente, 
    updateCliente 
} = require('../controllers/clientes.controllers');

router.get('/clientes', getClientes);

router.get('/cliente/:idClientes', getCliente);

router.post('/cliente', createCliente);

router.put('/cliente/:idClientes', updateCliente);

module.exports = router;