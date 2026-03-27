const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
// Definimos los caminos 
router.get('/clases', bookingController.obtenerClases);
router.post('/reservar', bookingController.reservarClase);
router.get('/mis-reservas/:usuarioId', bookingController.obtenerMisReservas);
router.delete('/cancelar/:id', bookingController.cancelarReserva);

module.exports = router;
