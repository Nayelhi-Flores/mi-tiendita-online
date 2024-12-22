const express = require('express');
const router = express.Router();
const { 
    getEstados, 
    getEstado, 
    createEstado, 
    updateEstado,
    deleteEstado
} = require('../controllers/estados.controllers');

router.get('/estados', getEstados);

router.get('/estado/:idEstado', getEstado);

router.post('/estado', createEstado);

router.put('/estado/:idEstado', updateEstado);

router.delete('/estado/:idEstado', deleteEstado);

module.exports = router;