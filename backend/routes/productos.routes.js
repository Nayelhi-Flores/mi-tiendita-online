const express = require('express');
const router = express.Router();
const { validarToken, validarRol } = require('../middlewares/auth');
const { 
    getProductos, 
    getProducto, 
    createProducto, 
    updateProducto,
    setProductoInactivo
} = require('../controllers/productos.controllers');

router.get('/productos', validarToken, getProductos);

router.get('/producto', validarToken, getProducto);

router.post('/producto', validarToken, validarRol(1), createProducto);

router.put('/producto/:idProductos', validarToken, validarRol(1), updateProducto);

router.put('deshabilitar/producto/:idProductos', validarToken, validarRol(1), setProductoInactivo);

module.exports = router;