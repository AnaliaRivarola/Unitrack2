const mongoose = require('mongoose');

const ParadaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ubicacion: {
    latitud: { type: Number, required: true },
    longitud: { type: Number, required: true }
  }
});

module.exports = mongoose.model('Parada', ParadaSchema);
