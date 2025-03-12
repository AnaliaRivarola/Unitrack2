// routes/paradaRoutes.js
const express = require('express');
const router = express.Router();
const ParadaController = require('../controllers/ParadaController');
const Parada = require('../models/parada.models');

// Ruta para obtener todas las paradas
router.get('/paradas', async (req, res) => {
  try {
    await ParadaController.getParadas(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las paradas', error: error.message });
  }
});

// Ruta para crear una parada
router.post('/paradas', async (req, res) => {
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
router.put('/paradas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, ubicacion } = req.body;

    if (!ubicacion || !ubicacion.latitud || !ubicacion.longitud) {
      return res.status(400).json({ message: 'Latitud y longitud son requeridos' });
    }

    // Actualizar la parada
    const parada = await Parada.findByIdAndUpdate(
      id,
      { nombre, ubicacion: { latitud: ubicacion.latitud, longitud: ubicacion.longitud } },
      { new: true }
    );

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
