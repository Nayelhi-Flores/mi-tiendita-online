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
const ROLES = require('../helpers/roles');

router.get('/ordenes', validarToken, validarRol(ROLES.OPERADOR), getOrdenes);

router.get('/orden/:idOrden', validarToken, getOrden);

router.post('/orden', validarToken, createOrden);

router.put('/orden/:idOrden', validarToken, updateOrden);

router.put('/cancelar/orden/:idOrden', validarToken, cancelarOrden);

router.put('/cambiar-estado/orden/:idOrden', validarToken, validarRol(ROLES.OPERADOR), cambiarEstadoOrden);

module.exports = router;