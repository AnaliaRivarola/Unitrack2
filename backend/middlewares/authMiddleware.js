// filepath: c:\Users\anali\Documents\Unitrack\backend\middlewares\authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware para autenticar JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.log('Token no proporcionado');
    return res.status(403).json({ mensaje: 'Acceso denegado, token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Error al verificar el token:', err);
      return res.status(403).json({ mensaje: 'Token no válido' });
    }

    console.log('Token decodificado:', decoded); // Log para verificar el contenido del token

    // Asegurarse de que req.usuario tenga el campo _id
    req.usuario = {
      ...decoded,
      _id: decoded._id || decoded.id, // Usar _id o id dependiendo de cómo esté configurado el token
    };

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