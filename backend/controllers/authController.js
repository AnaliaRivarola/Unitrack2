// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/usuario.models'); // Asegúrate de tener la ruta correcta de tu modelo
const Auditoria = require('../models/auditoria.models'); // Importa el modelo de auditoría

const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, contraseña, rol } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !email || !contraseña || !rol) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    // Verificar si el correo ya está registrado
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
    }

    // Verificar que solo los administradores puedan crear choferes
    if (req.usuario.rol === 'admin' && rol !== 'chofer') {
      return res.status(403).json({ success: false, message: 'No tienes permiso para crear este tipo de usuario' });
    }

    // Crear un nuevo usuario
    const nuevoUsuario = new User({
      nombre,
      email,
      contraseña, // La contraseña será encriptada automáticamente por el middleware en el modelo
      rol,
    });

    // Guardar el usuario en la base de datos
    await nuevoUsuario.save();

    // Registrar la acción en la tabla de auditoría
    try {
      await Auditoria.create({
        usuario: req.usuario._id, // Usuario que realizó la acción
        accion: 'crear',
        entidad: 'usuario',
        entidadId: nuevoUsuario._id,
        datosNuevos: nuevoUsuario,
      });
      console.log('Auditoría registrada correctamente');
    } catch (error) {
      console.error('Error al registrar auditoría:', error);
    }

    console.log('Datos para auditoría:', {
      usuario: req.usuario._id,
      accion: 'crear',
      entidad: 'usuario',
      entidadId: nuevoUsuario._id,
      datosNuevos: nuevoUsuario,
    });

    return res.status(201).json({ success: true, message: 'Usuario creado exitosamente', usuario: nuevoUsuario });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return res.status(500).json({ success: false, message: 'Error al crear usuario', error });
  }
};


// Función para manejar el login
const login = async (req, res) => {
  console.log('Datos recibidos en el login:', req.body); // Esto imprimirá los datos recibidos
  const { email, contraseña } = req.body;

  try {
    // Buscar al usuario por el email
    console.log('Consultando por el email:', emailNormalizado);  // Ver el email que se consulta
    const usuario = await User.findOne({ email: emailNormalizado });
    console.log('Usuario encontrado:', usuario);  // Ver lo que devuelve la consulta

    // Verificar la contraseña
    let esValida;
    try {
      esValida = await usuario.compararContraseña(contraseña);
    } catch (error) {
      console.error("Error al comparar la contraseña:", error);
      return res.status(500).json({ mensaje: 'Error al comparar la contraseña', error });
    }

    // Aquí es donde colocas el console.log para ver el resultado de la comparación
    console.log('Contraseña válida:', esValida); // Esto se verá en los logs del servidor

    if (!esValida) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }
    // Crear un JWT con el ID y el rol del usuario
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET, // Usar una variable de entorno para la clave secreta
      { expiresIn: '1h' } // El token expirará en 1 hora
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al procesar la solicitud', error });
  }
};


// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    console.log('Usuario autenticado:', req.usuario); // Log para verificar el usuario autenticado

    const usuarioAutenticado = req.usuario;

    let usuarios;
    if (usuarioAutenticado.rol === 'admin') {
      // El admin solo puede ver a los choferes
      usuarios = await User.find({ rol: 'chofer' }).select('-contraseña');
    } else {
      return res.status(403).json({ success: false, message: 'No tienes permiso para ver usuarios' });
    }

    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron usuarios' });
    }

    return res.json({ success: true, usuarios });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ success: false, message: 'Error al obtener usuarios', error });
  }
};

// Obtener un usuario específico por ID
const obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuarioId = req.params.id;

        const usuario = await User.findById(usuarioId).select('-contraseña');
        
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        return res.json({ success: true, usuario });
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return res.status(500).json({ success: false, message: 'Error al obtener el usuario' });
    }
};

const editarUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id; // ID del usuario a editar
    const usuarioAutenticado = req.usuario; // Usuario autenticado (extraído del token JWT)

    // Evitar que un usuario edite su propio perfil
    if (usuarioId === usuarioAutenticado.id) {
      return res.status(403).json({ success: false, message: 'No puedes editar tu propio usuario' });
    }

    const { nombre, email, contraseña, rol, estado } = req.body;

    const usuario = await User.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const datosAnteriores = { ...usuario._doc }; // Copia los datos actuales antes de modificarlos

    usuario.nombre = nombre || usuario.nombre;
    usuario.email = email || usuario.email;
    usuario.rol = rol || usuario.rol;
    usuario.estado = estado !== undefined ? estado : usuario.estado;

    if (contraseña) {
      const salt = await bcrypt.genSalt(10);
      usuario.contraseña = await bcrypt.hash(contraseña, salt);
    }

    const usuarioActualizado = await usuario.save();

    // Registrar la acción en la tabla de auditoría
    try {
      await Auditoria.create({
        usuario: usuarioAutenticado._id, // Usuario que realizó la acción
        accion: 'editar',
        entidad: 'usuario',
        entidadId: usuarioId,
        datosAnteriores,
        datosNuevos: usuarioActualizado,
      });
      console.log('Datos para auditoría (editar usuario):', {
        usuario: usuarioAutenticado._id,
        accion: 'editar',
        entidad: 'usuario',
        entidadId: usuarioId,
        datosAnteriores,
        datosNuevos: usuarioActualizado,
      });
      console.log('Auditoría registrada correctamente para editar usuario');
    } catch (error) {
      console.error('Error al registrar auditoría (editar usuario):', error);
    }

    return res.json({ success: true, message: 'Usuario actualizado exitosamente', usuario: usuarioActualizado });
  } catch (error) {
    console.error('Error al editar usuario:', error);
    return res.status(500).json({ success: false, message: 'Error al editar usuario', error });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id; // ID del usuario a eliminar
    const usuarioAutenticado = req.usuario; // Usuario autenticado (extraído del token JWT)

    // Evitar que un usuario elimine su propio perfil
    if (usuarioId === usuarioAutenticado.id) {
      return res.status(403).json({ success: false, message: 'No puedes eliminar tu propio usuario' });
    }

    const usuario = await User.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const datosAnteriores = { ...usuario._doc }; // Copia los datos actuales antes de eliminarlos

    await usuario.deleteOne();

    // Registrar la acción en la tabla de auditoría
    try {
      await Auditoria.create({
        usuario: usuarioAutenticado._id, // Usuario que realizó la acción
        accion: 'eliminar',
        entidad: 'usuario',
        entidadId: usuarioId,
        datosAnteriores,
      });
      console.log('Auditoría registrada correctamente para eliminar usuario');
    } catch (error) {
      console.error('Error al registrar auditoría (eliminar usuario):', error);
    }

    return res.json({ success: true, message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(500).json({ success: false, message: 'Error al eliminar usuario', error });
  }
};

module.exports = { login,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  editarUsuario,
  eliminarUsuario
};
