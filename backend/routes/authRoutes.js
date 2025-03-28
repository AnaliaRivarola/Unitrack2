// auth.js o el archivo donde manejas la ruta de login
const express = require('express');
const router = express.Router();
const User = require('../models/usuario.models.js'); // Asegúrate de que el nombre del modelo sea correcto
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Asegúrate de importar jwt
const { authenticateJWT, verifyRole } = require('../middlewares/authMiddleware');
const { obtenerUsuarios, obtenerUsuarioPorId, crearUsuario, editarUsuario, eliminarUsuario } = require('../controllers/authController');


// Ruta para crear un nuevo usuario (solo admin o superadmin)
router.post('/usuarios', authenticateJWT, verifyRole(['admin', 'superadmin']), crearUsuario);
// Ruta de login
router.post('/login', async (req, res) => {
    console.log('Ruta de login llamada');
    try {
        const { email, contraseña } = req.body;

        console.log('Datos recibidos en el backend:', req.body); 
        console.log('Email recibido:', email);

        // Intentamos buscar al usuario
        const usuario = await User.findOne({
            email: { $regex: `^${email}$`, $options: 'i' } // búsqueda sin importar mayúsculas/minúsculas
          });

        console.log('Usuario encontrado en la base de datos:', usuario); 

        if (!usuario) {
            return res.status(400).json({ mensaje: 'Usuario no encontrado' });
        }

        const esValido = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!esValido) {
            return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, rol: usuario.rol });
        
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

router.get('/me', authenticateJWT, (req, res) => {
    try {
      const usuario = req.usuario; // Usuario autenticado (extraído del token JWT)
      if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      return res.json({ success: true, usuario });
    } catch (error) {
      console.error('Error al obtener el usuario autenticado:', error);
      return res.status(500).json({ success: false, message: 'Error al obtener el usuario autenticado' });
    }
  });

// Ruta para obtener todos los usuarios
router.get('/usuarios', authenticateJWT, obtenerUsuarios);

// Ruta para obtener un usuario específico por su ID
router.get('/usuarios/:id', obtenerUsuarioPorId);

// Ruta para editar un usuario (requiere autenticación y permisos)
router.put('/usuarios/:id', authenticateJWT, verifyRole(['admin', 'superadmin']), editarUsuario);

// Ruta para eliminar un usuario (requiere autenticación y permisos)
router.delete('/usuarios/:id', authenticateJWT, verifyRole(['admin', 'superadmin']), eliminarUsuario);

module.exports = router;
