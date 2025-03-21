const mongoose = require('mongoose');

const TransporteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fecha_creacion: { type: Date, default: Date.now },
  paradas: [
    {
      parada: { type: mongoose.Schema.Types.ObjectId, ref: 'Parada', required: true },
      ubicacion: { type: String, required: true },
    },
  ],
  gpsId: { type: mongoose.Schema.Types.ObjectId, ref: 'GPS', required: true }, // Relación con el modelo GPS (obligatorio)
});

module.exports = mongoose.model('Transporte', TransporteSchema);
