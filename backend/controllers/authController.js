const Usuario = require('../models/usuario.models'); // Asegúrate de que la ruta sea correcta
const jwt = require('jsonwebtoken');

// Controlador para crear un usuario (registro)
const registerUser = async (req, res) => {
  const { id_usuario, nombre, tipo_usuario, email, telefono, password } = req.body;

  try {
    // Verificar si el email ya está registrado
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ success: false, message: 'El email ya está registrado.' });
    }

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      id_usuario,
      nombre,
      tipo_usuario,
      email,
      telefono,
      password, // Será hasheada automáticamente por el modelo
    });

    await nuevoUsuario.save();
    res.status(201).json({ success: true, message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al registrar usuario.', error });
  }
};

// Controlador para iniciar sesión
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña
    const isMatch = await usuario.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id: usuario.id_usuario, tipo_usuario: usuario.tipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ success: true, token, tipo_usuario: usuario.tipo_usuario });
  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

module.exports = { registerUser, loginUser };
