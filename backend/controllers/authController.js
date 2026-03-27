const bcrypt = require('bcrypt');
const db = require('../config/db');

// 1. REGISTRO DE USUARIOS
exports.registro = async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
        db.query(sql, [nombre, email, hashedPassword], (err) => {
            if (err) return res.status(500).json({ mensaje: 'Error al registrar' });
            res.json({ mensaje: `¡Bienvenido ${nombre}! Registro completado 🔒` });
        });
    } catch (e) { 
        res.status(500).json({ mensaje: 'Error interno' }); 
    }
};

// 2. LOGIN DE USUARIOS
exports.login = (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE email = ?';

    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
        if (results.length === 0) return res.status(401).json({ mensaje: 'Usuario no encontrado' });

        const usuario = results[0];
        const coinciden = await bcrypt.compare(password, usuario.password);

        if (coinciden) {
            res.json({ 
                mensaje: `¡Hola de nuevo, ${usuario.nombre}!`,
                id: usuario.id,
                nombre: usuario.nombre 
            });
        } else {
            res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }
    });
};

// 3. OBTENER PERFIL
exports.obtenerPerfil = (req, res) => {
    const id = req.params.id;
    db.query('SELECT nombre, email FROM usuarios WHERE id = ?', [id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ mensaje: 'Perfil no encontrado' });
        res.json(results[0]);
    });
};
