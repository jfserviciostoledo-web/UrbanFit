const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());

// 1. CONFIGURACIÓN DE CONEXIÓN A LA BASE DE DATOS
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
        res.status(500).json({ mensaje: 'Error interno en el servidor' }); 
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
                nombre: usuario.nombre 
            });
        } else {
            res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }
    });
});

// 4. RUTA PARA OBTENER TODAS LAS CLASES
app.get('/clases', (req, res) => {
    const sql = 'SELECT * FROM clases';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al consultar clases:', err);
            return res.status(500).json({ mensaje: 'Error al obtener las clases' });
        }
        res.json(results);
    });
});

// 5. RUTA PARA REALIZAR UNA RESERVA
app.post('/reservar', (req, res) => {
    const { nombreUsuario, claseId } = req.body;
    const sqlUsuario = 'SELECT id FROM usuarios WHERE nombre = ?';
    
    db.query(sqlUsuario, [nombreUsuario], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        const usuarioId = results[0].id;
        const sqlReserva = 'INSERT INTO reservas (usuario_id, clase_id) VALUES (?, ?)';
        
        db.query(sqlReserva, [usuarioId, claseId], (err) => {
            if (err) {
                console.error('Error al reservar:', err);
                return res.status(500).json({ mensaje: 'No se pudo realizar la reserva' });
            }
            res.json({ mensaje: '✅ Reserva realizada con éxito' });
        });
    });
});

// 6. RUTA PARA VER MIS RESERVAS 
app.get('/mis-reservas/:nombreUsuario', (req, res) => {
    const nombre = req.params.nombreUsuario;
    const sql = `
        SELECT reservas.id, clases.nombre, clases.hora 
        FROM reservas 
        JOIN usuarios ON reservas.usuario_id = usuarios.id 
        JOIN clases ON reservas.clase_id = clases.id 
        WHERE usuarios.nombre = ?`;

    db.query(sql, [nombre], (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error al consultar' });
        res.json(results);
    });
});

// 7. RUTA PARA CANCELAR RESERVA
app.delete('/cancelar/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM reservas WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ mensaje: 'Error al cancelar' });
        res.json({ mensaje: 'Reserva cancelada correctamente' });
    });
});

// 8. INICIO DEL SERVIDOR
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 SERVIDOR CORRIENDO EN http://localhost:${PORT}`);
});
