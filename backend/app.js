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

// 2. INTENTAR CONECTAR (Esto es lo que te falta ver en la consola)
db.connect((err) => {
    if (err) {
        console.error('❌ ERROR AL CONECTAR A MYSQL:', err.message);
        return;
    }
    console.log('✅ CONECTADO A LA BASE DE DATOS DE XAMPP');
});

// 3. RUTA DE REGISTRO
app.post('/registro', async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const sql = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
        db.query(sql, [nombre, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error en la query:', err);
                return res.status(500).json({ mensaje: 'Error al guardar' });
            }
            console.log(`✅ Socio seguro en DB: ${nombre}`);
            res.json({ mensaje: `¡Bienvenido ${nombre}! Tu cuenta es segura 🔒` });
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al cifrar contraseña' });
    }
});
// 4. RUTA DE LOGIN
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error en el servidor' });

        if (results.length === 0) {
            return res.status(401).json({ mensaje: 'El usuario no existe' });
        }

        const usuario = results[0];

        // Comparamos la contraseña escrita con la encriptada en la DB
        const coinciden = await bcrypt.compare(password, usuario.password);

        if (coinciden) {
            res.json({ mensaje: `¡Bienvenido de nuevo, ${usuario.nombre}!`, usuarioId: usuario.id });
        } else {
            res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }
    });
});

app.listen(3000, () => {
    console.log('🚀 SERVIDOR SEGURO EN http://localhost:3000');
});
