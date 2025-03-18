// auth.js o el archivo donde manejas la ruta de login
const express = require('express');
const router = express.Router();
const User = require('../models/usuario.models.js'); // Asegúrate de que el nombre del modelo sea correcto
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Asegúrate de importar jwt
const { obtenerUsuarios, obtenerUsuarioPorId } = require('../controllers/authController.js'); // Importamos las funciones del controlador
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

// Ruta para obtener todos los usuarios
router.get('/usuarios', obtenerUsuarios);

// Ruta para obtener un usuario específico por su ID
router.get('/usuarios/:id', obtenerUsuarioPorId);
module.exports = router;
