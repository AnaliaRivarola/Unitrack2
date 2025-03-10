const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Faltaba importar mongoose
const Horario = require('../models/horario.models');
const Transporte = require('../models/transporte.models'); // Faltaba importar Transporte


// Ruta para crear un nuevo horario
router.post('/', async (req, res) => {
  const { id_transporte, hora_salida, hora_regreso, origen } = req.body;

  // Validar que id_transporte sea un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(id_transporte)) {
    return res.status(400).json({ message: 'ID de transporte inválido' });
  }

  try {
    // Verificar que el transporte existe antes de crear el horario
    const transporteExistente = await Transporte.findById(id_transporte);
    if (!transporteExistente) {
      return res.status(404).json({ message: 'Transporte no encontrado' });
    }

    // Crear y guardar el horario en la base de datos
    const nuevoHorario = new Horario({
      id_transporte,
      hora_salida,
      hora_regreso,
      origen,
    });

    await nuevoHorario.save();
    res.status(201).json({ message: 'Horario creado exitosamente', horario: nuevoHorario });
  } catch (error) {
    console.error('Error al crear horario:', error);
    res.status(500).json({ message: 'Error al crear el horario' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const transporte = await Transporte.findById(req.params.id);
    if (!transporte) {
      return res.status(404).json({ message: 'Transporte no encontrado' });
    }
    res.json(transporte);
  } catch (error) {
    console.error('Error al obtener transporte:', error);
    res.status(500).json({ message: 'Error al obtener transporte' });
  }
});

router.get('/', async (req, res) => {
  try {
    console.log('📡 Recibiendo solicitud para obtener horarios');

    const horarios = await Horario.find()
      .populate('id_transporte') // Asegúrate de que el campo id_transporte está en el modelo
      .populate('id_transporte.paradas.parada'); // Si esto causa error, prueba quitándolo

    if (!horarios || horarios.length === 0) {
      console.warn('⚠️ No se encontraron horarios');
      return res.status(404).json({ message: 'No se encontraron horarios' });
    }

    console.log('✅ Horarios encontrados:', horarios);
    res.json(horarios);
  } catch (error) {
    console.error('❌ Error al obtener los horarios:', error.message);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});


module.exports = router;