const express = require('express');
const router = express.Router();
const { validarToken, validarRol } = require('../middlewares/auth');
const { 
    getOrdenes, 
    getOrden, 
    createOrden, 
    updateOrden, 
    cancelarOrden, 
    cambiarEstadoOrden 
} = require('../controllers/ordenes.controllers');

router.get('/ordenes', validarToken, validarRol(1), getOrdenes);

router.get('/orden/:idOrden', validarToken, getOrden);

router.post('/orden', validarToken, createOrden);

router.put('/orden/:idOrden', validarToken, updateOrden);

router.put('/cancelar/orden/:idOrden', validarToken, cancelarOrden);

router.put('/cambiar-estado/orden/:idOrden', validarToken, validarRol(1), cambiarEstadoOrden);

module.exports = router;