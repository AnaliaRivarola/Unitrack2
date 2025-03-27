// controllers/ParadaController.js
const Parada = require('../models/parada.models');
const Auditoria = require('../models/auditoria.models'); // Importa el modelo de auditoría
const Transporte = require('../models/transporte.models');
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


// Obtener todas las paradas (para estudiantes, sin autenticación)
exports.getParadasEstudiantes = async (req, res) => {
  try {
    const paradas = await Parada.find().lean(); // Obtén todas las paradas
    res.json(paradas);
  } catch (error) {
    console.error('Error al obtener las paradas para estudiantes:', error);
    res.status(500).json({ message: 'Error al obtener las paradas', error });
  }
};

// Obtener paradas asociadas al transporte del chofer (requiere autenticación)
exports.getParadasChofer = async (req, res) => {
  try {
    console.log('Usuario autenticado en getParadasChofer:', req.usuario);

    if (!req.usuario) {
      return res.status(403).json({ message: 'Usuario no autenticado' });
    }

    const choferId = req.usuario._id;
    console.log('ID del chofer:', choferId);

    const transporte = await Transporte.findOne({ id_usuario: choferId }).populate('paradas.parada');
    console.log('Transporte después de populate:', JSON.stringify(transporte, null, 2));

    if (!transporte) {
      return res.status(404).json({ message: 'No se encontró un transporte asociado al chofer' });
    }

    const paradas = transporte.paradas
      .filter((p) => p.parada) // Filtra las paradas que no tienen datos
      .map((p) => ({
        _id: p.parada._id,
        nombre: p.parada.nombre,
        latitud: p.parada.ubicacion.latitud,
        longitud: p.parada.ubicacion.longitud,
      }));

    console.log('Paradas encontradas para el chofer:', paradas);
    res.json({ paradas }); // Devuelve un objeto con la propiedad "paradas"
  } catch (error) {
    console.error('Error al obtener las paradas del chofer:', error);
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
