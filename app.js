const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Vuelo = require('./models/vuelo');
const path = require('path');

const app = express();

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/vuelos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión:', err));

// Middleware para parsear JSON
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para manejar las reservas de vuelos
app.post('/api/vuelos', async (req, res) => {
    try {
        console.log('Datos recibidos en el servidor:', req.body);
        const { origen, destino, dia } = req.body;
        const nuevoVuelo = new Vuelo({ origen, destino, dia });
        const vueloGuardado = await nuevoVuelo.save();
        console.log('Vuelo guardado en la base de datos:', vueloGuardado);
        res.json(vueloGuardado);
    } catch (error) {
        console.error('Error al guardar el vuelo:', error);
        res.status(500).json({ error: 'Error al guardar el vuelo' });
    }
});

// Endpoint para obtener todos los vuelos agendados
app.get('/api/vuelos', async (req, res) => {
    try {
        const vuelos = await Vuelo.find();
        res.json(vuelos);
    } catch (error) {
        console.error('Error al obtener los vuelos:', error);
        res.status(500).json({ error: 'Error al obtener los vuelos' });
    }
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});

// Endpoint para eliminar un vuelo
app.delete('/api/vuelos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Vuelo.findByIdAndDelete(id);
        res.json({ message: 'Vuelo eliminado' });
    } catch (error) {
        console.error('Error al eliminar el vuelo:', error);
        res.status(500).json({ error: 'Error al eliminar el vuelo' });
    }
});
