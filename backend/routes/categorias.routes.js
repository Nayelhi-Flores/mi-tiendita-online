const express = require('express');
const router = express.Router();
const { validarToken, validarRol } = require('../middlewares/auth');
const { 
    getCategorias, 
    getCategoria, 
    createCategoria, 
    updateCategoria, 
    setCategoriaInactivo
} = require('../controllers/categorias.controllers');

router.get('/categorias', validarToken, getCategorias);

router.get('/categoria', validarToken, getCategoria);

router.post('/categoria', validarToken, validarRol(1), createCategoria);

router.put('/categoria/:idCategoria', validarToken, validarRol(1), updateCategoria);

router.put('deshabilitar/categoria/:idCategoria', validarToken, validarRol(1), setCategoriaInactivo);

module.exports = router;