const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  rol: { type: String, enum: ['superadmin', 'admin', 'chofer'], required: true },
  fecha_creación: { type: Date, default: Date.now },
  estado: { type: Boolean, default: true } // Activo por defecto
});

// Encriptar la contraseña antes de guardarla
userSchema.pre('save', async function(next) {
  if (!this.isModified('contraseña')) return next();
  this.contraseña = await bcrypt.hash(this.contraseña, 10);
  next();
});

// Compara la contraseña ingresada con la almacenada en la base de datos
userSchema.methods.compararContraseña = async function (contraseña) {
  return await bcrypt.compare(contraseña, this.contraseña);
};

module.exports = mongoose.model('User', userSchema, 'usuarios');
