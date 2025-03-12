// controllers/ParadaController.js
const Parada = require('../models/parada.models');

exports.createParada = async (req, res) => {
  const { nombre, ubicacion } = req.body;

  try {
    if (!ubicacion || !ubicacion.latitud || !ubicacion.longitud) {
      return res.status(400).json({ message: "Latitud y longitud son requeridos" });
    }

    const nuevaParada = new Parada({
      nombre,
      ubicacion: {
        latitud: ubicacion.latitud,
        longitud: ubicacion.longitud,
      },
    });

    await nuevaParada.save();
    res.status(201).json(nuevaParada);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear parada', error });
  }
};

exports.getParadas = async (req, res) => {
  try {
    const paradas = await Parada.find();
    res.json(paradas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las paradas', error });
  }
};
