const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ mensaje: 'No tienes el token de acceso' });
    }

    // Usamos una clave secreta (pon la que quieras, pero recuérdala)
    jwt.verify(token, 'CLAVE_SECRETA_URBANFIT', (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: 'Token inválido o caducado' });
        }
        req.usuarioId = decoded.id; // Guardamos el ID del token para usarlo luego
        next(); 
    });
};
