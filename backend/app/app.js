const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Usamos las rutas como "módulos"
app.use('/auth', authRoutes);
app.use('/gym', bookingRoutes);

app.listen(3000, () => console.log("🚀 Servidor MVC corriendo"));
