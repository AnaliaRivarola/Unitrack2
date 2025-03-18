// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/usuario.models'); // Asegúrate de tener la ruta correcta de tu modelo

// Función para manejar el login
const login = async (req, res) => {
  console.log('Datos recibidos en el login:', req.body); // Esto imprimirá los datos recibidos
  const { email, contraseña } = req.body;

  try {
    // Buscar al usuario por el email
    console.log('Consultando por el email:', emailNormalizado);  // Ver el email que se consulta
    const usuario = await User.findOne({ email: emailNormalizado });
    console.log('Usuario encontrado:', usuario);  // Ver lo que devuelve la consulta

    // Verificar la contraseña
    let esValida;
    try {
      esValida = await usuario.compararContraseña(contraseña);
    } catch (error) {
      console.error("Error al comparar la contraseña:", error);
      return res.status(500).json({ mensaje: 'Error al comparar la contraseña', error });
    }

    // Aquí es donde colocas el console.log para ver el resultado de la comparación
    console.log('Contraseña válida:', esValida); // Esto se verá en los logs del servidor

    if (!esValida) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }
    // Crear un JWT con el ID y el rol del usuario
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET, // Usar una variable de entorno para la clave secreta
      { expiresIn: '1h' } // El token expirará en 1 hora
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al procesar la solicitud', error });
  }
};


// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
    try {
        // Obtener todos los usuarios excluyendo la contraseña
        const usuarios = await User.find().select('-contraseña');
        
        // Si no se encuentran usuarios, enviar un mensaje de error
        if (!usuarios || usuarios.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron usuarios' });
        }

        // Responder con los usuarios
        return res.json({ success: true, usuarios });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
    }
};

// Obtener un usuario específico por ID
const obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuarioId = req.params.id;

        const usuario = await User.findById(usuarioId).select('-contraseña');
        
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        return res.json({ success: true, usuario });
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return res.status(500).json({ success: false, message: 'Error al obtener el usuario' });
    }
};




module.exports = { login,
  obtenerUsuarios,
  obtenerUsuarioPorId
 };
