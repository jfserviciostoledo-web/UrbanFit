const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());

// 1. CONFIGURACIÓN DE CONEXIÓN
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'urbanfit_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error conexión:', err.message);
        return;
    }
    console.log('✅ CONECTADO A LA BASE DE DATOS DE XAMPP');
});

// 2. RUTA DE REGISTRO
app.post('/registro', async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
        db.query(sql, [nombre, email, hashedPassword], (err) => {
            if (err) return res.status(500).json({ mensaje: 'Error al registrar' });
            res.json({ mensaje: `¡Bienvenido ${nombre}! Registro completado 🔒` });
        });
    } catch (e) { res.status(500).json({ mensaje: 'Error interno' }); }
});

// 3. RUTA DE LOGIN (La que envía el nombre)
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE email = ?';

    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });
        if (results.length === 0) return res.status(401).json({ mensaje: 'Usuario no encontrado' });

        const usuario = results[0];
        const coinciden = await bcrypt.compare(password, usuario.password);

        if (coinciden) {
            // Enviamos el nombre para que el index.html lo use
            res.json({ 
                mensaje: `¡Hola de nuevo, ${usuario.nombre}!`,
                nombre: usuario.nombre 
            });
        } else {
            res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }
    });
});
app.listen(3000, () => console.log('🚀 SERVIDOR SEGURO EN PORT 3000'));
