const express = require('express');
const router = express.Router();
const { 
    getProductos, 
    getProducto, 
    createProducto, 
    updateProducto,
    setProductoInactivo
} = require('../controllers/productos.controllers');

router.get('/productos', getProductos);

router.get('/producto', getProducto);

router.post('/producto', createProducto);

router.put('/producto/:idProductos', updateProducto);

router.put('deshabilitar/producto/:idProductos', setProductoInactivo);

module.exports = router;