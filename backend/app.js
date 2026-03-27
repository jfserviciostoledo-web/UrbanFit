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
    } catch (e) { 
        res.status(500).json({ mensaje: 'Error interno' }); 
    }
});

// 3. RUTA DE LOGIN 
app.post('/login', (req, res) => {
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
                id: usuario.id, // IMPORTANTE: Enviamos el ID
                nombre: usuario.nombre 
            });
        } else {
            res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }
    });
});

// 4. OBTENER CLASES
app.get('/clases', (req, res) => {
    db.query('SELECT * FROM clases', (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error al obtener clases' });
        res.json(results);
    });
});

// 5. REALIZAR RESERVA 
app.post('/reservar', (req, res) => {
    const { usuarioId, claseId } = req.body; // Recibimos IDs directamente

    // Comprobamos si ya existe la reserva
    const sqlCheck = 'SELECT * FROM reservas WHERE usuario_id = ? AND clase_id = ?';
    db.query(sqlCheck, [usuarioId, claseId], (err, results) => {
        if (results.length > 0) {
            return res.status(400).json({ mensaje: 'Ya tienes una reserva para esta clase' });
        }

        const sqlReserva = 'INSERT INTO reservas (usuario_id, clase_id) VALUES (?, ?)';
        db.query(sqlReserva, [usuarioId, claseId], (err) => {
            if (err) return res.status(500).json({ mensaje: 'Error al reservar' });
            res.json({ mensaje: '✅ Reserva realizada con éxito' });
        });
    });
});

// 6. VER MIS RESERVAS 
app.get('/mis-reservas/:usuarioId', (req, res) => {
    const usuarioId = req.params.usuarioId;
    const sql = `
        SELECT reservas.id, clases.nombre, clases.hora 
        FROM reservas 
        JOIN clases ON reservas.clase_id = clases.id 
        WHERE reservas.usuario_id = ?`;

    db.query(sql, [usuarioId], (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error al consultar' });
        res.json(results);
    });
});

// 7. CANCELAR RESERVA
app.delete('/cancelar/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM reservas WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ mensaje: 'Error al cancelar' });
        res.json({ mensaje: 'Reserva cancelada correctamente' });
    });
});

// 8. NUEVA RUTA: OBTENER PERFIL DE USUARIO
app.get('/perfil/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT nombre, email FROM usuarios WHERE id = ?', [id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ mensaje: 'Perfil no encontrado' });
        res.json(results[0]);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 SERVIDOR CORRIENDO EN http://localhost:${PORT}`);
});
