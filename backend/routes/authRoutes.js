const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Definimos los caminos para los usuarios
router.post('/registro', authController.registro);
router.post('/login', authController.login);
router.get('/perfil/:id', authController.obtenerPerfil);

module.exports = router;
