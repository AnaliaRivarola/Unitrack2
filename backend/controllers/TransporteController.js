// controllers/TransporteController.js
const Transporte = require('../models/transporte.models');
const Parada = require('../models/parada.models');
const Auditoria = require('../models/auditoria.models');
const GPS = require('../models/gps.models');

// Crear un nuevo transporte
exports.createTransporte = async (req, res) => {
  try {
    console.log("Datos recibidos en el backend:", req.body); // Verifica los datos recibidos

    const { nombre, id_usuario, paradas, gpsId } = req.body;

    // Validar que las paradas sean IDs válidos de paradas existentes
    const paradasValidas = await Parada.find({ '_id': { $in: paradas.map(p => p.parada) } });
    if (paradasValidas.length !== paradas.length) {
      return res.status(400).json({ message: 'Algunas paradas no son válidas' });
    }

    // Validar que el GPS exista
    if (!gpsId) {
      return res.status(400).json({ message: 'El campo gpsId es obligatorio' });
    }

    const gps = await GPS.findById(gpsId);
    if (!gps) {
      return res.status(404).json({ message: 'GPS no encontrado' });
    }

    // Crear el nuevo transporte
    const nuevoTransporte = new Transporte({
      nombre,
      id_usuario,
      paradas,
      gpsId, // Asociar el GPS directamente
    });

    console.log("Transporte a guardar:", nuevoTransporte); // Verifica el objeto antes de guardarlo

    await nuevoTransporte.save();

    // Registrar la acción en la tabla de auditoría
    await Auditoria.create({
      usuario: req.usuario._id, // Usuario autenticado que realiza la acción
      accion: 'crear',
      entidad: 'transporte',
      entidadId: nuevoTransporte._id,
      datosNuevos: nuevoTransporte,
    });

    res.status(201).json({ message: 'Transporte creado exitosamente', transporte: nuevoTransporte });
  } catch (error) {
    console.error('Error al crear transporte:', error);
    res.status(500).json({ message: 'Error al crear el transporte', error: error.message });
  }
};

// Obtener todos los transportes con las paradas pobladas
exports.getAllTransportes = async (req, res) => {
  try {
    const transportes = await Transporte.find()

    res.status(200).json(transportes);
  } catch (error) {
    console.error("Error al obtener los transportes:", error);
    res.status(500).json({ message: "Error al obtener los transportes" });
  }
};

// Obtener un transporte por su ID con paradas pobladas
exports.getTransporteById = async (req, res) => {
  const { id } = req.params;

  // Verificar si el ID tiene un formato válido
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "ID de transporte inválido" });
  }

  try {
    const transporte = await Transporte.findById(id).populate("paradas.parada"); // Poblar las paradas

    if (!transporte) {
      return res.status(404).json({ message: "Transporte no encontrado" });
    }

    res.status(200).json(transporte);
  } catch (error) {
    console.error("Error al obtener transporte por ID:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Editar un transporte
exports.updateTransporte = async (req, res) => {
  try {
    const { nombre, paradas, id_usuario, gpsId } = req.body;

    // Validar que las paradas sean IDs válidos de paradas existentes
    const paradasValidas = await Parada.find({ '_id': { $in: paradas.map(p => p.parada) } });
    if (paradasValidas.length !== paradas.length) {
      return res.status(400).json({ message: 'Algunas paradas no son válidas' });
    }

    const transporte = await Transporte.findById(req.params.id);
    if (!transporte) {
      return res.status(404).json({ message: 'Transporte no encontrado' });
    }

    const datosAnteriores = { ...transporte._doc }; // Copia los datos actuales antes de modificarlos

    // Actualizar el transporte
    transporte.nombre = nombre || transporte.nombre;
    transporte.paradas = paradas || transporte.paradas;
    transporte.id_usuario = id_usuario || transporte.id_usuario;
    transporte.gpsId = gpsId || transporte.gpsId;
    const transporteActualizado = await transporte.save();

    // Registrar la acción en la tabla de auditoría
    await Auditoria.create({
      usuario: req.usuario._id, // Usuario autenticado que realiza la acción
      accion: 'editar',
      entidad: 'transporte',
      entidadId: transporte._id,
      datosAnteriores,
      datosNuevos: transporteActualizado,
    });

    res.status(200).json({ message: 'Transporte actualizado exitosamente', transporte: transporteActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el transporte' });
  }
};

// Eliminar un transporte
exports.deleteTransporte = async (req, res) => {
  try {
    const transporte = await Transporte.findById(req.params.id);

    if (!transporte) {
      return res.status(404).json({ message: "Transporte no encontrado" });
    }

    // Verifica que req.usuario esté definido
    if (!req.usuario || !req.usuario._id) {
      return res.status(401).json({ message: "No autorizado. Usuario no autenticado." });
    }

    // Eliminar el transporte
    await transporte.deleteOne();

    // Registrar la acción en la tabla de auditoría
    await Auditoria.create({
      usuario: req.usuario._id, // Usuario autenticado que realiza la acción
      accion: "eliminar",
      entidad: "transporte",
      entidadId: transporte._id,
      datosAnteriores: transporte, // Guarda los datos del transporte eliminado
    });

    res.status(200).json({ message: "Transporte eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el transporte:", error);
    res.status(500).json({ message: "Error al eliminar el transporte" });
  }
};



exports.asociarGpsATransporte = async (req, res) => {
  const { transporteId, gpsId } = req.body;

  try {
    // Verifica si el transporte existe
    const transporte = await Transporte.findById(transporteId);
    if (!transporte) {
      return res.status(404).json({ message: 'Transporte no encontrado' });
    }

    // Verifica si el GPS existe
    const gps = await GPS.findById(gpsId);
    if (!gps) {
      return res.status(404).json({ message: 'GPS no encontrado' });
    }

    // Asocia el GPS al transporte
    transporte.gpsId = gps._id;
    await transporte.save();

    res.status(200).json({ message: 'GPS asociado al transporte exitosamente', transporte });
  } catch (error) {
    console.error('Error al asociar GPS al transporte:', error);
    res.status(500).json({ message: 'Error al asociar GPS al transporte', error: error.message });
  }
};

exports.obtenerTransporteConGps = async (req, res) => {
  const { transporteId } = req.params;

  try {
    // Busca el transporte y popula el GPS asociado
    const transporte = await Transporte.findById(transporteId).populate('gpsId');
    if (!transporte) {
      return res.status(404).json({ message: 'Transporte no encontrado' });
    }

    res.status(200).json(transporte);
  } catch (error) {
    console.error('Error al obtener transporte con GPS:', error);
    res.status(500).json({ message: 'Error al obtener transporte con GPS', error: error.message });
  }
};

// Obtener las paradas asociadas a un transporte
exports. getParadasPorTransporte = async (req, res) => {
  try {
    const transporte = await Transporte.findById(req.params.id).populate('paradas.parada');

    if (!transporte) {
      return res.status(404).json({ mensaje: 'Transporte no encontrado' });
    }

    const paradas = transporte.paradas.map(p => p.parada);
    res.json(paradas);
  } catch (error) {
    console.error('Error al obtener paradas del transporte:', error);
    res.status(500).json({ mensaje: 'Error al obtener las paradas' });
  }
};