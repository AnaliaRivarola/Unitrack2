// filepath: c:\Users\anali\Documents\Unitrack\backend\middlewares\authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware para autenticar JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    console.log('Token no proporcionado');
    return res.status(403).json({ mensaje: 'Acceso denegado, token no proporcionado' });
  }

  const token = authHeader.split(' ')[1]; // Extrae el token después de "Bearer"

  if (!token) {
    console.log('Token no proporcionado después de Bearer');
    return res.status(403).json({ mensaje: 'Acceso denegado, token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Error al verificar el token:', err);
      return res.status(403).json({ mensaje: 'Token no válido' });
    }

    console.log('Token decodificado:', decoded); // Log para verificar el contenido del token

    req.usuario = {
      _id: decoded._id || decoded.id, // Usar _id o id dependiendo de cómo esté configurado el token
      rol: decoded.rol, // Asegurarse de incluir el rol
    };

    console.log('Usuario autenticado en req.usuario:', req.usuario); // Verifica que req.usuario esté configurado
    next();
  });
};
// Middleware para verificar roles
const verifyRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.usuario.rol)) {
    return res.status(403).json({ mensaje: "Acceso denegado" });
  }
  next();
};

module.exports = { authenticateJWT, verifyRole };