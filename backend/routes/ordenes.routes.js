const express = require('express');
const router = express.Router();
const { 
    getOrdenes, 
    getOrden, 
    createOrden, 
    updateOrden, 
    cancelarOrden, 
    cambiarEstadoOrden 
} = require('../controllers/ordenes.controllers');

router.get('/ordenes', getOrdenes);

router.get('/orden/:idOrden', getOrden);

router.post('/orden', createOrden);

router.put('/orden/:idOrden', updateOrden);

router.put('/cancelar/orden/:idOrden', cancelarOrden);

router.put('/cambiar-estado/orden/:idOrden', cambiarEstadoOrden);

module.exports = router;