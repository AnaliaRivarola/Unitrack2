const mongoose = require('mongoose');

const gpsSchema = new mongoose.Schema({
  dispositivoId: {
    type: String,
    required: true,
    unique: true, // Asegura que no haya dispositivos duplicados
  },
  tokenFlespi: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: false, // Información adicional sobre el GPS
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('GPS', gpsSchema);