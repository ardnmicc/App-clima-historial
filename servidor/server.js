const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Historial = require('./historial_ciudades'); 

const app = express();
app.use(cors());
app.use(express.json()); 

const db = 'mongodb://localhost:27017/climaapp';
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/iconos', express.static(path.join(__dirname, '..', 'iconos')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.post('/api/historial', async (req, res) => {
  const { ciudad } = req.body;
  const nuevaCiudad = new Historial({ ciudad });
  await nuevaCiudad.save();
  res.status(201).json(nuevaCiudad);
});

app.get('/api/historial', async (req, res) => {
  const ciudades_historial = await Historial.find().sort({ fecha: -1 }).limit(10);
  res.json(ciudades_historial);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
