const express = require('express');
const router = express.Router();
const { 
    getCategorias, 
    getCategoria, 
    createCategoria, 
    updateCategoria, 
    setCategoriaInactivo
} = require('../controllers/categorias.controllers');

router.get('/categorias', getCategorias);

router.get('/categoria', getCategoria);

router.post('/categoria', createCategoria);

router.put('/categoria/:idCategoria', updateCategoria);

router.put('deshabilitar/categoria/:idCategoria', setCategoriaInactivo);

module.exports = router;