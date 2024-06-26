// app.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/db');

// Crear una instancia de la aplicación Express
const app = express();

// Middleware para parsear JSON
app.use(bodyParser.json());

// Rutas
app.use('/api/users', userRoutes);

// Configurar el puerto
const PORT = process.env.PORT || 5000;

// Sincronizar la base de datos y arrancar el servidor
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(err => {
  console.error('Error al sincronizar la base de datos:', err);
});
