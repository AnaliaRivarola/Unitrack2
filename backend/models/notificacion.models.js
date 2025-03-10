const NotificacionSchema = new mongoose.Schema({
    id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    id_transporte: { type: mongoose.Schema.Types.ObjectId, ref: 'Transporte' },
    mensaje: { type: String, required: true },
    tipo: { type: String, enum: ['info', 'advertencia', 'error'], required: true },
    fecha_creacion: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Notificacion', NotificacionSchema);
  