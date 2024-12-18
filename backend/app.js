const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sequelize = require('./sequelize');
const routes = require('./routes/index');

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Middleware
app.use(bodyParser.json());

// Ruta base
app.get('/', (req, res) => {
    res.send('API de mi-tiendita-online funcionando.');
});

// Rutas de la API
app.use('/api', routes);

// Conexión a la base de datos
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos exitosa.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
})();

// Consulta de Prueba
(async () => {
    try {
        const [results] = await sequelize.query("SELECT * FROM Usuarios");
        console.log('Datos de la tabla usuarios:', results);
    } catch (error) {
        console.error('Error al consultar la tabla usuarios:', error);
    }
})();

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
