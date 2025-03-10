// routes/usuarioRoutes.js
const express = require('express');
const Usuario = require('../models/usuario.models'); // Ruta correcta al modelo Usuario
const router = express.Router();

// Ruta para obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
  try {
    // Obtener todos los usuarios desde la base de datos
    const usuarios = await Usuario.find();
    
    // Enviar la lista de usuarios en la respuesta
    res.status(200).json({ success: true, usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener usuarios', error: error.message });
  }
});

module.exports = router;
