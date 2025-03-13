const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Faltaba importar mongoose
const Horario = require('../models/horario.models');
const Transporte = require('../models/transporte.models'); // Faltaba importar Transporte
const HorarioController = require('../controllers/HorarioController');

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
  console.log("Ruta llamada con ID:", req.params.id);  // Esto debe mostrar el ID recibido en la URL
  try {
    const horario = await Horario.findById(req.params.id).populate('id_transporte');
    if (!horario) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }
    res.json(horario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el horario', error });
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

// Ruta para actualizar un horario existente
router.put('/:id', async (req, res) => {
  const { id } = req.params; // Obtenemos el ID del horario a editar
  const { id_transporte, hora_salida, hora_regreso, origen } = req.body; // Datos nuevos

  // Validar que id_transporte sea un ObjectId válido
  if (id_transporte && !mongoose.Types.ObjectId.isValid(id_transporte)) {
    return res.status(400).json({ message: 'ID de transporte inválido' });
  }

  try {
    // Buscar el horario por ID
    const horarioExistente = await Horario.findById(id).populate('id_transporte');
    if (!horarioExistente) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }

    // Verificar si el transporte existe antes de asignarlo
    if (id_transporte) {
      const transporteExistente = await Transporte.findById(id_transporte);
      if (!transporteExistente) {
        return res.status(404).json({ message: 'Transporte no encontrado' });
      }
      horarioExistente.id_transporte = id_transporte;
    }

    // Actualizar otros campos si se proporcionan
    horarioExistente.hora_salida = hora_salida || horarioExistente.hora_salida;
    horarioExistente.hora_regreso = hora_regreso || horarioExistente.hora_regreso;
    horarioExistente.origen = origen || horarioExistente.origen;

    // Guardar los cambios
    await horarioExistente.save();

    res.json({ message: 'Horario actualizado exitosamente', horario: horarioExistente });
  } catch (error) {
    console.error('Error al actualizar el horario:', error);
    res.status(500).json({ message: 'Error al actualizar el horario', error: error.message });
  }
});


// Elimina un horario por su ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Obtenemos el ID del horario a eliminar
  try {
    const horarioEliminado = await Horario.findByIdAndDelete(id);

    if (!horarioEliminado) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }

    res.json({ message: 'Horario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el horario:', error);
    res.status(500).json({ message: 'Error al eliminar el horario', error: error.message });
  }
});

module.exports = router;