// controllers/ParadaController.js
const Parada = require('../models/parada.models');
const Auditoria = require('../models/auditoria.models'); // Importa el modelo de auditoría

// Crear una nueva parada
exports.createParada = async (req, res) => {
  const { nombre, ubicacion } = req.body;

  try {
    if (!ubicacion || !ubicacion.latitud || !ubicacion.longitud) {
      return res.status(400).json({ message: 'Latitud y longitud son requeridos' });
    }

    const nuevaParada = new Parada({
      nombre,
      ubicacion: {
        latitud: ubicacion.latitud,
        longitud: ubicacion.longitud,
      },
    });

    await nuevaParada.save();

    // Registrar la acción en la tabla de auditoría
    try {
      await Auditoria.create({
        usuario: req.usuario._id, // Usuario autenticado que realiza la acción
        accion: 'crear',
        entidad: 'parada',
        entidadId: nuevaParada._id,
        datosNuevos: nuevaParada,
      });
      console.log('Auditoría registrada correctamente para crear parada');
    } catch (error) {
      console.error('Error al registrar auditoría (crear parada):', error);
    }

    res.status(201).json(nuevaParada);
  } catch (error) {
    console.error('Error al crear parada:', error);
    res.status(500).json({ message: 'Error al crear parada', error });
  }
};

// Obtener todas las paradas
exports.getParadas = async (req, res) => {
  try {
    console.log('Usuario autenticado en getParadas:', req.usuario); // Log para verificar el usuario
    const paradas = await Parada.find();
    res.json(paradas);
  } catch (error) {
    console.error('Error al obtener las paradas:', error);
    res.status(500).json({ message: 'Error al obtener las paradas', error });
  }
};

// Actualizar una parada
exports.updateParada = async (req, res) => {
  const { id } = req.params;
  const { nombre, ubicacion } = req.body;

  try {
    console.log('Solicitud recibida para actualizar parada:', req.body);

    if (!ubicacion || !ubicacion.latitud || !ubicacion.longitud) {
      return res.status(400).json({ message: 'Latitud y longitud son requeridos' });
    }

    const paradaExistente = await Parada.findById(id);

    if (!paradaExistente) {
      console.log('Parada no encontrada con ID:', id);
      return res.status(404).json({ message: 'Parada no encontrada' });
    }

    const datosAnteriores = { ...paradaExistente._doc }; // Copia los datos actuales antes de modificarlos

    const paradaActualizada = await Parada.findByIdAndUpdate(
      id,
      { nombre, ubicacion: { latitud: ubicacion.latitud, longitud: ubicacion.longitud } },
      { new: true }
    );

    // Registrar la acción en la tabla de auditoría
    try {
      await Auditoria.create({
        usuario: req.usuario._id, // Usuario autenticado que realiza la acción
        accion: 'editar',
        entidad: 'parada',
        entidadId: id,
        datosAnteriores,
        datosNuevos: paradaActualizada,
      });
      console.log('Auditoría registrada correctamente para editar parada');
    } catch (error) {
      console.error('Error al registrar auditoría (editar parada):', error);
    }

    console.log('Parada actualizada:', paradaActualizada);
    res.json(paradaActualizada);
  } catch (error) {
    console.error('Error al actualizar la parada:', error);
    res.status(500).json({ message: 'Hubo un error al actualizar la parada' });
  }
};

// Eliminar una parada
exports.deleteParada = async (req, res) => {
  const { id } = req.params;

  try {
    const paradaEliminada = await Parada.findByIdAndDelete(id);

    if (!paradaEliminada) {
      return res.status(404).json({ message: 'Parada no encontrada' });
    }

    // Registrar la acción en la tabla de auditoría
    try {
      await Auditoria.create({
        usuario: req.usuario._id, // Usuario autenticado que realiza la acción
        accion: 'eliminar',
        entidad: 'parada',
        entidadId: id,
        datosAnteriores: paradaEliminada,
      });
      console.log('Auditoría registrada correctamente para eliminar parada');
    } catch (error) {
      console.error('Error al registrar auditoría (eliminar parada):', error);
    }

    res.status(200).json({ message: 'Parada eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la parada:', error);
    res.status(500).json({ message: 'Error al eliminar la parada', error: error.message });
  }
};
