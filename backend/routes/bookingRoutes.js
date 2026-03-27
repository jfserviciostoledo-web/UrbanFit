const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

// 1. RUTA PÚBLICA (Ver el horario)
router.get('/clases', bookingController.obtenerClases);

// 2. RUTAS PROTEGIDAS (Solo con Token válido)
// Ahora, para reservar o cancelar, el servidor exige el token)
router.post('/reservar', authMiddleware, bookingController.reservarClase);
router.get('/mis-reservas/:usuarioId', authMiddleware, bookingController.obtenerMisReservas);
router.delete('/cancelar/:id', authMiddleware, bookingController.cancelarReserva);

module.exports = router;

