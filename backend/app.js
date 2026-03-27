const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Conectamos las rutas
app.use(authRoutes);    // Esto activa /login, /registro, /perfil
app.use(bookingRoutes); // Esto activa /clases, /reservar, etc.

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 SERVIDOR MVC PROFESIONAL EN http://localhost:${PORT}`);
});
