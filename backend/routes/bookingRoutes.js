const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Definimos los caminos limpios
router.post('/reservar', bookingController.reservarClase);
router.delete('/cancelar/:id', bookingController.cancelarReserva);

module.exports = router
