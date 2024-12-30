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
const ROLES = require('../helpers/roles');

router.get('/categorias', validarToken, getCategorias);

router.get('/categoria', validarToken, getCategoria);

router.post('/categoria', validarToken, validarRol(ROLES.OPERADOR), createCategoria);

router.put('/categoria/:idCategoria', validarToken, validarRol(ROLES.OPERADOR), updateCategoria);

router.put('/deshabilitar/categoria/:idCategoria', validarToken, validarRol(ROLES.OPERADOR), setCategoriaInactivo);

module.exports = router;