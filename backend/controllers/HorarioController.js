const mongoose = require('mongoose');
const Horario = require('../models/horario.models');

// Crear un nuevo horario
const crearHorario = async (req, res) => {
  const { id_transporte, hora_salida, hora_regreso, origen } = req.body;

  // Validamos que el id_transporte sea un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(id_transporte)) {
    return res.status(400).json({ message: 'ID de transporte inválido' });
  }

  try {
    const nuevoHorario = new Horario({
      id_transporte: mongoose.Types.ObjectId(id_transporte),
      hora_salida,
      hora_regreso,
      origen
    });
    

    await nuevoHorario.save();
    res.status(201).json({ message: 'Horario creado exitosamente', horario: nuevoHorario });
  } catch (error) {
    console.error('Error al crear horario:', error);
    res.status(500).json({ message: 'Error al crear el horario' });
  }
};

// Obtener los horarios
exports.getHorarios = async (req, res) => {
  try {
    const horarios = await Horario.find(); // Intentamos obtener los horarios
    
    if (!horarios || horarios.length === 0) {
      return res.status(404).json({ message: 'No se encontraron horarios' });
    }

    res.json(horarios);
  } catch (error) {
    console.error('Error en getHorarios:', error); // 👈 Esto imprimirá el error en la terminal
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// Exportar las funciones
module.exports = { 
  crearHorario,
};
