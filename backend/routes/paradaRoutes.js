// routes/paradaRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authMiddleware');
const ParadaController = require('../controllers/ParadaController');
const Parada = require('../models/parada.models');

// Ruta para obtener todas las paradas
router.get('/paradas', authenticateJWT, ParadaController.getParadas);

// Ruta para crear una parada
router.post('/paradas', authenticateJWT, ParadaController.createParada);

// Ruta para eliminar una parada
router.delete('/paradas/:id', authenticateJWT, ParadaController.deleteParada);

// Ruta para obtener una parada por ID
router.get('/paradas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const parada = await Parada.findById(id);

    if (!parada) {
      return res.status(404).json({ message: 'Parada no encontrada' });
    }

    res.json(parada);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la parada', error: error.message });
  }
});

// Ruta para actualizar una parada
router.put('/paradas/:id', authenticateJWT, ParadaController.updateParada);

module.exports = router;
