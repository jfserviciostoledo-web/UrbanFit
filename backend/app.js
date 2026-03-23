const express = require('express');
const app = express();
const port = 3000;

// Configuración para poder leer datos de formularios (JSON)
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor del Gimnasio UrbanFit funcionando 🚀');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
