const express = require('express');

const clientesRoutes = require('./clientes.routes');
const productosRoutes = require('./productos.routes');
const categoriasRoutes = require('./categorias.routes');
const estadosRoutes = require('./estados.routes');
const usuariosRoutes = require('./usuarios.routes');
const ordenesRoutes = require('./ordenes.routes');
const auth = require('./auth.routes');

const router = express.Router();

router.get('/status', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

router.use(clientesRoutes);
router.use(productosRoutes);
router.use(categoriasRoutes);
router.use(estadosRoutes);
router.use(usuariosRoutes);
router.use(ordenesRoutes);
router.use(auth);

module.exports = router;