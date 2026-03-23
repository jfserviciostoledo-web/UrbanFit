const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// RUTA DE REGISTRO
app.post('/registro', (req, res) => {
    const { nombre, email, password } = req.body;
    
    // De momento, simulamos que lo guardamos (luego lo conectaremos a MySQL)
    console.log(`Nuevo registro: ${nombre} - ${email}`);
    
    res.json({ 
        mensaje: `¡Usuario ${nombre} recibido con éxito en el servidor!` 
    });
});

app.listen(port, () => {
    console.log(`Servidor de UrbanFit corriendo en http://localhost:${port}`);
});
