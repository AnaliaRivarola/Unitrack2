const mongoose = require('mongoose');

const ParadaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ubicacion: { type: String, required: true },
});

module.exports = mongoose.model('Parada', ParadaSchema);
