// controllers/TransporteController.js
const Transporte = require('../models/transporte.models');
const Parada = require('../models/parada.models');

// Crear un nuevo transporte
exports.createTransporte = async (req, res) => {
  try {
    const { nombre, id_usuario, coban_id, paradas } = req.body;

    // Validar que las paradas sean IDs válidos de paradas existentes
    const paradasValidas = await Parada.find({ '_id': { $in: paradas.map(p => p.parada) } });
    if (paradasValidas.length !== paradas.length) {
      return res.status(400).json({ message: 'Algunas paradas no son válidas' });
    }

    const nuevoTransporte = new Transporte({
      nombre,
      id_usuario,
      coban_id,
      paradas,
    });

    await nuevoTransporte.save();
    res.status(201).json({ message: 'Transporte creado exitosamente', transporte: nuevoTransporte });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el transporte' });
  }
};

// Obtener todos los transportes con las paradas pobladas
exports.getAllTransportes = async (req, res) => {
  try {
    const transportes = await Transporte.find().populate('paradas.parada'); // Esto traerá los detalles de las paradas
    res.status(200).json(transportes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los transportes' });
  }
};

// Obtener un transporte por su ID con paradas pobladas

exports.getTransporteById = async (req, res) => {
  const { id } = req.params;
  
  // Verificar si el ID tiene un formato válido
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'ID de transporte inválido' });
  }

  try {
    const transporte = await Transporte.findById(id).populate('paradas.parada'); // Poblar las paradas

    if (!transporte) {
      return res.status(404).json({ message: 'Transporte no encontrado' });
    }

    res.status(200).json(transporte);
  } catch (error) {
    console.error('Error al obtener transporte por ID:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


// Editar un transporte
exports.updateTransporte = async (req, res) => {
  try {
    const { nombre, coban_id, paradas } = req.body;

    // Validar que las paradas sean IDs válidos de paradas existentes
    const paradasValidas = await Parada.find({ '_id': { $in: paradas.map(p => p.parada) } });
    if (paradasValidas.length !== paradas.length) {
      return res.status(400).json({ message: 'Algunas paradas no son válidas' });
    }

    const transporte = await Transporte.findByIdAndUpdate(
      req.params.id,
      { nombre, coban_id, paradas },
      { new: true }  // Devuelve el transporte actualizado
    );

    if (!transporte) {
      return res.status(404).json({ message: 'Transporte no encontrado' });
    }

    res.status(200).json({ message: 'Transporte actualizado exitosamente', transporte });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el transporte' });
  }
};

// Eliminar un transporte
exports.deleteTransporte = async (req, res) => {
  try {
    const transporte = await Transporte.findByIdAndDelete(req.params.id);

    if (!transporte) {
      return res.status(404).json({ message: 'Transporte no encontrado' });
    }

    res.status(200).json({ message: 'Transporte eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el transporte' });
  }
};

