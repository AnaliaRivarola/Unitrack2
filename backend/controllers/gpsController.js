const GPS = require('../models/gps.models');
const { obtenerUbicacionDesdeFlespi } = require('../utils/flespiUtils');
const gpsController = require('../controllers/gpsController');


// Obtener la ubicación de un dispositivo GPS
exports.getUbicacion = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca el dispositivo GPS en la base de datos
    const gps = await GPS.findOne({ dispositivoId: id });
    if (!gps) {
      return res.status(404).json({ message: 'GPS no encontrado' });
    }

    // Obtén la ubicación desde Flespi
    const ubicacion = await obtenerUbicacionDesdeFlespi(gps.dispositivoId, gps.tokenFlespi);
    if (!ubicacion) {
      return res.status(404).json({ message: 'No se pudo obtener la ubicación del GPS' });
    }

    // Devuelve la ubicación al cliente
    res.json({ dispositivoId: gps.dispositivoId, ...ubicacion });
  } catch (error) {
    console.error('Error al obtener la ubicación:', error);
    res.status(500).json({ message: 'Error al obtener la ubicación', error: error.message });
  }
};

exports.createGps = async (req, res) => {
  const { dispositivoId, tokenFlespi, descripcion } = req.body;

  try {
    const gpsExistente = await GPS.findOne({ dispositivoId });
    if (gpsExistente) {
      return res.status(400).json({ message: 'El dispositivo GPS ya está registrado' });
    }

    const nuevoGps = new GPS({ dispositivoId, tokenFlespi, descripcion });
    await nuevoGps.save();

    res.status(201).json({ message: 'GPS registrado exitosamente', gps: nuevoGps });
  } catch (error) {
    console.error('Error al registrar GPS:', error);
    res.status(500).json({ message: 'Error al registrar GPS', error: error.message });
  }
};

exports.deleteGps = async (req, res) => {
  const { id } = req.params;

  try {
    const gpsEliminado = await GPS.findByIdAndDelete(id);
    if (!gpsEliminado) {
      return res.status(404).json({ message: 'GPS no encontrado' });
    }

    res.json({ message: 'GPS eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar GPS:', error);
    res.status(500).json({ message: 'Error al eliminar GPS', error: error.message });
  }
};

exports.getAllGps = async (req, res) => {
  try {
    const gpsDispositivos = await GPS.find(); // Obtiene todos los dispositivos GPS
    res.status(200).json(gpsDispositivos);
  } catch (error) {
    console.error('Error al obtener dispositivos GPS:', error);
    res.status(500).json({ message: 'Error al obtener dispositivos GPS', error: error.message });
  }
};