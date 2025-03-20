const mongoose = require('mongoose');

const auditoriaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Relación con el modelo de usuario
    required: true,
  },
  accion: {
    type: String,
    enum: ['crear', 'editar', 'eliminar'],
    required: true,
  },
  entidad: {
    type: String,
    required: true, // Por ejemplo: 'transporte', 'usuario'
  },
  entidadId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // ID del registro afectado
  },
  datosAnteriores: {
    type: Object, // Datos antes del cambio 
  },
  datosNuevos: {
    type: Object, // Datos después del cambio 
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Auditoria', auditoriaSchema);