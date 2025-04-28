// Requiere las dependencias necesarias para configurar el servidor Express y manejar las rutas
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const customerRoutes = require('./routes/customerRoutes');

// Habilita CORS para permitir solicitudes desde otros dominios
app.use(cors());

// Configura el middleware para analizar el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());

// Rutas de la API: 
// - '/api/auth' para las rutas relacionadas con la autenticación
// - '/api/admin' para las rutas administrativas
// - '/api/customer' para las rutas de los clientes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);

// Define el puerto en el que el servidor escuchará las solicitudes
// Si no se encuentra la variable de entorno 'PORT', se usará el puerto 3000 por defecto
const port = process.env.PORT || 3000;

// Inicia el servidor en el puerto especificado y muestra un mensaje en la consola
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
