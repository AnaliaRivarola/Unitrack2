// routes/paradaRoutes.js
const express = require('express');
const router = express.Router();
const ParadaController = require('../controllers/ParadaController');
const Parada = require('../models/parada.models');

// Ruta para obtener todas las paradas
router.get('/paradas', async (req, res) => {  // Ahora está en /api/paradas
  try {
    await ParadaController.getParadas(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las paradas', error: error.message });
  }
});

// Ruta para crear una parada
router.post('/paradas', async (req, res) => {  // Ahora está en /api/paradas
  try {
    await ParadaController.createParada(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la parada', error: error.message });
  }
});

// Ruta para eliminar una parada
router.delete('/paradas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Parada.findByIdAndDelete(id);
    res.status(200).json({ message: 'Parada eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la parada', error: error.message });
  }
});

router.get('/paradas/:id', (req, res) => {
  const { id } = req.params;
  Parada.findById(id)
    .then(parada => {
      if (!parada) {
        return res.status(404).json({ message: 'Parada no encontrada' });
      }
      res.json(parada);
    })
    .catch(err => res.status(500).json({ message: 'Error al obtener la parada', error: err }));
});

router.put('/paradas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, ubicacion } = req.body;
    
    // Actualizar la parada
    const parada = await Parada.findByIdAndUpdate(id, { nombre, ubicacion }, { new: true });
    
    if (!parada) {
      return res.status(404).json({ message: 'Parada no encontrada' });
    }

    res.json(parada);
  } catch (error) {
    console.error('Error al actualizar la parada:', error);
    res.status(500).json({ message: 'Hubo un error al actualizar la parada' });
  }
});

module.exports = router;
