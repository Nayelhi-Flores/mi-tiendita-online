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
const ROLES = require('../helpers/roles');

router.get('/productos', validarToken, getProductos);

router.get('/producto', validarToken, getProducto);

router.post('/producto', validarToken, validarRol(ROLES.OPERADOR), createProducto);

router.put('/producto/:idProductos', validarToken, validarRol(ROLES.OPERADOR), updateProducto);

router.put('/deshabilitar/producto/:idProductos', validarToken, validarRol(ROLES.OPERADOR), setProductoInactivo);

module.exports = router;