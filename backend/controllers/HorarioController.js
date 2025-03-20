const mongoose = require('mongoose');
const Horario = require('../models/horario.models');
const Auditoria = require('../models/auditoria.models'); // Importa el modelo de auditoría

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

    // Registrar la acción en la tabla de auditoría
    try {
      await Auditoria.create({
        usuario: req.usuario._id, // Usuario autenticado que realiza la acción
        accion: 'crear',
        entidad: 'horario',
        entidadId: nuevoHorario._id,
        datosNuevos: nuevoHorario,
      });
      console.log('Auditoría registrada correctamente para crear horario');
    } catch (error) {
      console.error('Error al registrar auditoría (crear horario):', error);
    }

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

// Editar un horario
const editarHorario = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID del horario a editar
  const { hora_salida, hora_regreso, origen, id_transporte } = req.body; // Obtenemos los datos nuevos

  try {
    const horarioExistente = await Horario.findById(id); // Buscamos el horario por su ID

    if (!horarioExistente) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }

    const datosAnteriores = { ...horarioExistente._doc }; // Copia los datos actuales antes de modificarlos

    // Actualizamos los campos con los nuevos valores, si están presentes
    horarioExistente.hora_salida = hora_salida || horarioExistente.hora_salida;
    horarioExistente.hora_regreso = hora_regreso || horarioExistente.hora_regreso;
    horarioExistente.origen = origen || horarioExistente.origen;
    horarioExistente.id_transporte = id_transporte || horarioExistente.id_transporte; // Actualizamos el transporte

    // Guardamos el horario actualizado
    const horarioActualizado = await horarioExistente.save();

    // Registrar la acción en la tabla de auditoría
    try {
      await Auditoria.create({
        usuario: req.usuario._id, // Usuario autenticado que realiza la acción
        accion: 'editar',
        entidad: 'horario',
        entidadId: id,
        datosAnteriores,
        datosNuevos: horarioActualizado,
      });
      console.log('Auditoría registrada correctamente para editar horario');
    } catch (error) {
      console.error('Error al registrar auditoría (editar horario):', error);
    }

    res.json({ message: 'Horario actualizado exitosamente', horario: horarioActualizado });
  } catch (error) {
    console.error('Error al editar el horario:', error);
    res.status(500).json({ message: 'Error al actualizar el horario', error: error.message });
  }
};

// Eliminar un horario
const eliminarHorario = async (req, res) => {
  const { id } = req.params;
  try {
    const horarioEliminado = await Horario.findByIdAndDelete(id);

    if (!horarioEliminado) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }

    // Registrar la acción en la tabla de auditoría
    try {
      await Auditoria.create({
        usuario: req.usuario._id, // Usuario autenticado que realiza la acción
        accion: 'eliminar',
        entidad: 'horario',
        entidadId: id,
        datosAnteriores: horarioEliminado,
      });
      console.log('Auditoría registrada correctamente para eliminar horario');
    } catch (error) {
      console.error('Error al registrar auditoría (eliminar horario):', error);
    }

    console.log('Datos para auditoría:', {
      usuario: req.usuario._id,
      accion: 'eliminar',
      entidad: 'horario',
      entidadId: id,
      datosAnteriores: horarioEliminado,
    });

    res.json({ message: 'Horario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el horario:', error);
    res.status(500).json({ message: 'Error al eliminar el horario', error: error.message });
  }
};

// Exportar las funciones
module.exports = { 
  crearHorario,
  editarHorario,
  eliminarHorario
};
