const bcrypt = require('bcrypt');
const db = require('../config/db');

exports.registro = async (req, res) => {
    const { nombre, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
    db.query(sql, [nombre, email, hashedPassword], (err) => {
        if (err) return res.status(500).json({ mensaje: 'Error al registrar' });
        res.json({ mensaje: `¡Bienvenido ${nombre}!` });
    });
};

exports.login = (req, res) => {
};
