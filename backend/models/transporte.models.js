const mongoose = require('mongoose');
const TransporteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  coban_id: { type: String, required: true },
  fecha_creacion: { type: Date, default: Date.now },
  paradas: [  // Referencia a paradas
    {
      parada: { type: mongoose.Schema.Types.ObjectId, ref: 'Parada', required: true }, // Referencia a la parada
      ubicacion: { type: String, required: true },  
    },
  ],
});

module.exports = mongoose.model('Transporte', TransporteSchema);
