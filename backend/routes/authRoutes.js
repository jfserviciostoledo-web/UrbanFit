const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware'); 

// 1. RUTAS PÚBLICAS 
router.post('/registro', authController.registro);
router.post('/login', authController.login);

// 2. RUTA PROTEGIDA 
// El perfil ahora requiere que el usuario esté "logueado" de verdad
router.get('/perfil/:id', authMiddleware, authController.obtenerPerfil);

module.exports = router;
