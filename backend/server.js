const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { Server } = require('socket.io'); // Importa Socket.IO
const http = require('http'); // Necesario para crear el servidor HTTP
const { iniciarConsultaPeriodica } = require('./utils/flespiUtils'); // Importa la función
const fetch = require('node-fetch'); // Importar fetch para hacer peticiones a Flespi
const Transporte = require("./models/transporte.models"); 
const app = express();
const server = http.createServer(app); // Crea el servidor HTTP
const io = new Server(server, {
  cors: {
    origin: "*", // Permitir todas las conexiones (ajusta según sea necesario)
  },
});
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/usuario.models'); // Ruta a tu modelo de usuario
const usuariosRoutes = require('./routes/authRoutes');
// Importar las rutas
const paradaRoutes = require('./routes/paradaRoutes');
const transporteRoutes = require('./routes/transporteRoutes');
const authRoutes = require('./routes/authRoutes');
const { obtenerUsuarios } = require('./controllers/authController');
const { authenticateJWT } = require('./middlewares/authMiddleware');
const horarioRoutes = require('./routes/horarioRoutes');
const gpsRoutes = require('./routes/gpsRoutes'); // Importa las rutas de GPS
const generarHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("Contraseña encriptada:", hashedPassword);
};

const contactoRoutes = require("./routes/contactoRoutes");

app.get('/test', (req, res) => {
  res.json({ message: 'Backend funcionando en Vercel' });
});

// Reemplaza '123456' con la contraseña que quieres usar
generarHash('123456');
// =============================
// Middleware
// =============================
app.use(cors()); // Permite solicitudes desde diferentes orígenes (CORS)
app.use(express.json()); // Permite leer JSON en las peticiones

// =============================
// Conectar a MongoDB
// =============================
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Conectado a MongoDB");
}).catch((error) => {
  console.error("❌ Error al conectar a MongoDB:", error);
});

// Inicia la consulta periódica y pasa la instancia de io
iniciarConsultaPeriodica(io);

// =============================
// Definir rutas de la API
// =============================
app.get('/Unitrack', (req, res) => {
  res.json({ message: '¡Conexión exitosa con el backend!' });
});


app.get('/api/usuarios', obtenerUsuarios);

app.use('/api', paradaRoutes); // Rutas de paradas
app.use('/api', transporteRoutes); // Rutas de transporte
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/horarios', horarioRoutes); // Rutas de horarios
app.use('/api', usuariosRoutes);
app.use('/api/gps', gpsRoutes); // Registra las rutas bajo el prefijo /api/gps
app.use('/api', gpsRoutes); // Registra las rutas bajo el prefijo /api
app.use("/api", contactoRoutes);


app.use('/api/protected-route', authenticateJWT, (req, res) => {
  res.json({ message: 'Ruta protegida' });
});


//AUTENTICACION 
const login = async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    const esValida = await usuario.compararContraseña(contraseña);
    if (!esValida) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol }, // El rol sí se incluye en el token
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 🔹 Ahora enviamos el rol también en la respuesta
    res.json({ token, rol: usuario.rol });

  } catch (error) {
    res.status(500).json({ mensaje: "Error al procesar la solicitud", error: error.message });
  }
};





// =============================
// Integración de WebSocket (Socket.IO)
// =============================

// 1. Importamos el módulo 'http' y creamos un servidor HTTP basado en Express
// 2. Importamos Socket.IO y lo configuramos
// 3. Escuchar eventos de conexión y desconexión de clientes WebSocket
io.on("connection", (socket) => {
  console.log("🔗 Nuevo cliente conectado:", socket.id);

  // Escuchar ubicación del estudiante y reenviar a los conductores
  socket.on("ubicacionEstudiante", (data) => {
    console.log("📥 Ubicación del estudiante recibida en el servidor:", data);
    io.emit("ubicacionEstudiante", data); // Reenviar a todos los conductores
  });


  // Escuchar cuando el chofer confirma que esperará al estudiante
  socket.on("choferEsperara", (data) => {
    console.log("🟢 Chofer esperará al estudiante en:", data);
    io.emit("choferEsperara", data); // Enviar evento a los estudiantes
  });
  
  //Escuchar cuando el chofer manda un mensaje
  socket.on("mensaje-conductor", (mensaje) => {
    console.log("Mensaje recibido del conductor:", mensaje);
    io.emit("mensaje-estudiante", mensaje); // Enviar a todos los estudiantes
  });

  // Escuchar cuando el chofer confirma que no esperará al estudiante
  socket.on("choferNoEsperara", (data) => {
    console.log("🔴 Chofer no esperará al estudiante en:", data);
    io.emit("choferNoEsperara", data); // Enviar evento a los estudiantes
  });
  // Manejo de desconexión
  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado:", socket.id);
  });
});




// =============================
// Inicio del servidor HTTP
// =============================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
