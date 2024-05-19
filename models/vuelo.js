const mongoose = require('mongoose');

const vueloSchema = new mongoose.Schema({
    origen: { type: String, required: true },
    destino: { type: String, required: true },
    dia: { type: String, required: true }
});

module.exports = mongoose.model('Vuelo', vueloSchema);
