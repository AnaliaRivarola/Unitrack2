const DispositivoSchema = new mongoose.Schema({
    id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    fecha_registro: { type: Date, default: Date.now },
    tipo_cel: { type: String, required: true },
  });
  
  module.exports = mongoose.model('Dispositivo', DispositivoSchema);
  