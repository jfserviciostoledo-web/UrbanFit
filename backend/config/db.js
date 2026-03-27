const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'urbanfit_db'
});

db.connect((err) => {
    if (err) console.error('❌ Error conexión:', err.message);
    else console.log('✅ CONECTADO A LA BASE DE DATOS');
});

module.exports = db; 
