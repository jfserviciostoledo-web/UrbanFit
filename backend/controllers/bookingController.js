const db = require('../config/db');

// 1. OBTENER TODAS LAS CLASES
exports.obtenerClases = (req, res) => {
    db.query('SELECT * FROM clases', (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error al obtener clases' });
        res.json(results);
    });
};

// 2. REALIZAR RESERVA (Lógica de IDs, Duplicados y Plazas)
exports.reservarClase = (req, res) => {
    const { usuarioId, claseId } = req.body;

    // A. Comprobar si ya existe la reserva
    const sqlCheck = 'SELECT * FROM reservas WHERE usuario_id = ? AND clase_id = ?';
    db.query(sqlCheck, [usuarioId, claseId], (err, results) => {
        if (results && results.length > 0) {
            return res.status(400).json({ mensaje: 'Ya tienes una reserva para esta clase' });
        }

        // B. Comprobar disponibilidad de plazas
        const sqlPlazas = 'SELECT cupo_max, inscritos FROM clases WHERE id = ?';
        db.query(sqlPlazas, [claseId], (err, clase) => {
            if (err || clase.length === 0) return res.status(404).json({ mensaje: 'Clase no encontrada' });

            if (clase[0].inscritos >= clase[0].cupo_max) {
                return res.status(400).json({ mensaje: 'Clase completa. No quedan plazas disponibles 🚫' });
            }

            // C. Insertar reserva y actualizar contador de la clase
            const sqlInsert = 'INSERT INTO reservas (usuario_id, clase_id) VALUES (?, ?)';
            db.query(sqlInsert, [usuarioId, claseId], (err) => {
                if (err) return res.status(500).json({ mensaje: 'Error al reservar' });

                // Sumamos 1 al contador de la clase (Lógica de Negocio)
                db.query('UPDATE clases SET inscritos = inscritos + 1 WHERE id = ?', [claseId]);
                
                res.json({ mensaje: '✅ Reserva realizada con éxito' });
            });
        });
    });
};

// 3. VER RESERVAS DE UN USUARIO ESPECÍFICO
exports.obtenerMisReservas = (req, res) => {
    const usuarioId = req.params.usuarioId;
    const sql = `
        SELECT reservas.id, clases.nombre, clases.hora 
        FROM reservas 
        JOIN clases ON reservas.clase_id = clases.id 
        WHERE reservas.usuario_id = ?`;

    db.query(sql, [usuarioId], (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error al consultar reservas' });
        res.json(results);
    });
};

// 4. CANCELAR RESERVA Y LIBERAR PLAZA
exports.cancelarReserva = (req, res) => {
    const reservaId = req.params.id;

    // Primero identificamos la clase para restar el contador de inscritos
    db.query('SELECT clase_id FROM reservas WHERE id = ?', [reservaId], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ mensaje: 'Reserva no encontrada' });

        const claseId = results[0].clase_id;

        // Borramos la reserva de la tabla 'reservas'
        db.query('DELETE FROM reservas WHERE id = ?', [reservaId], (err) => {
            if (err) return res.status(500).json({ mensaje: 'Error al cancelar' });

            // Restamos 1 al contador de la clase (Liberamos el hueco)
            db.query('UPDATE clases SET inscritos = inscritos - 1 WHERE id = ?', [claseId]);
            
            res.json({ mensaje: 'Reserva cancelada y plaza liberada correctamente' });
        });
    });
};
