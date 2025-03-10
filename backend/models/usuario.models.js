const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
  id_usuario: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  tipo_usuario: { type: String, required: true, enum: ['chofer', 'admin'] }, 
  email: { type: String, required: true, unique: true },
  telefono: { type: String },
  password: { type: String, required: true },
  fecha_creacion: { type: Date, default: Date.now },
});

// Middleware para encriptar la contraseña antes de guardar
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Solo encripta si el password ha cambiado
  const salt = await bcrypt.genSalt(10); // Generar salt
  this.password = await bcrypt.hash(this.password, salt); // Hashear la contraseña
  next();
});

// Método para comparar contraseñas
UsuarioSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
