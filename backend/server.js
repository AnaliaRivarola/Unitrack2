const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const fetch = require('node-fetch'); // Importar fetch para hacer peticiones a Flespi
const Transporte = require("./models/transporte.models"); 
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/usuario.models'); // Ruta a tu modelo de usuario
const usuariosRoutes = require('./routes/authRoutes');
// Importar las rutas
const paradaRoutes = require('./routes/paradaRoutes');
const transporteRoutes = require('./routes/transporteRoutes');
const authRoutes = require('./routes/authRoutes');

const horarioRoutes = require('./routes/horarioRoutes');
const generarHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("Contraseña encriptada:", hashedPassword);
};

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

// =============================
// Definir rutas de la API
// =============================
app.get('/Unitrack', (req, res) => {
  res.json({ message: '¡Conexión exitosa con el backend!' });
});

app.get('/api/usuarios', (req, res) => {
  // Lógica para obtener los usuarios
  res.json({ success: true, usuarios: [] });
});

app.use(express.json());
app.use('/api', paradaRoutes); // Rutas de paradas
app.use('/api', transporteRoutes); // Rutas de transporte
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/horarios', horarioRoutes); // Rutas de horarios
app.use('/api', usuariosRoutes);



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




const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(403).json({ mensaje: "Acceso denegado, token no proporcionado" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ mensaje: "Token no válido" });

    req.usuario = decoded; // Asegúrate de que `req.user` tenga `id` y `rol`
    next();
  });
};

// Middleware para verificar el rol del usuario (solo admin o chofer)
const verifyRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.usuario.rol)) {
    return res.status(403).json({ mensaje: "Acceso denegado" });
  }
  next();
};

// =============================
// Integración de WebSocket (Socket.IO)
// =============================

// 1. Importamos el módulo 'http' y creamos un servidor HTTP basado en Express
const http = require('http');
const server = http.createServer(app);

// 2. Importamos Socket.IO y lo configuramos
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*", // Permite todas las conexiones (puedes cambiarlo por una URL específica si es necesario)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,  // Habilitar credenciales si las necesitas
  }
});
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
// Integración con Flespi para obtener ubicación en tiempo real
// =============================

const FLESPI_TOKEN = "R4LrxOHIA7De8z1hUOCiLbxE7BUNpUKSif9yzByr9mcTIPe6BQ0cc9Wkip3F4SNL";
const DEVICE_ID = "6267248"; // ID del dispositivo en Flespi
const FLESPI_URL = `https://flespi.io/gw/devices/${DEVICE_ID}/messages?`;

const obtenerUbicacionDesdeFlespi = async () => {
  try {
    const response = await fetch(FLESPI_URL, {
      method: "GET",
      headers: {
        "Authorization": `FlespiToken ${FLESPI_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (data.result && data.result.length > 0) {
      const mensaje = data.result.reduce((max, item) => 
        item.timestamp > max.timestamp ? item : max, data.result[0]);

      if (!mensaje) {
        console.log("⚠️ No se encontraron mensajes con coordenadas.");
        return null;
      }

      console.log("🔍 Contenido del mensaje:", JSON.stringify(mensaje, null, 2));

      const latitud = mensaje["position.latitude"];
      const longitud = mensaje["position.longitude"];
      const timestamp = mensaje.timestamp || null;

      console.log("🔍 Coordenadas recibidas:", latitud, longitud);

      const ubicacion = {
        latitud,
        longitud,
        tipo: "gps_transporte",
        timestamp
      };

      console.log("📌 Ubicación enviada:", ubicacion);
      return ubicacion;
    } else {
      console.log("⚠️ No se encontraron datos en la respuesta de Flespi.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error al obtener datos desde Flespi:", error);
    return null;
  }
};


// Consulta periódica de la ubicación cada 5 segundos
setInterval(async () => {
  const ubicacion = await obtenerUbicacionDesdeFlespi(); // Obtener datos de Flespi

  if (ubicacion) {
    console.log("🚀 Enviando ubicación actualizada:", ubicacion);
    io.emit("ubicacionActualizada", ubicacion); // Enviar ubicación a los clientes WebSocket
  }
}, 5000);

// =============================
// Inicio del servidor HTTP
// =============================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
