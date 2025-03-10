const mongoose = require('mongoose');

const HorarioSchema = new mongoose.Schema({
  id_horarios: { type: String, required: true, unique: true },
  id_transporte: { type: mongoose.Schema.Types.ObjectId, ref: 'Transporte', required: true },
  hora_salida: { type: String, required: true }, // Usamos String para almacenar el tiempo
  hora_regreso: { type: String, required: true },
  origen: { type: String, required: true },
  fecha_creacion: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Horario', HorarioSchema);
