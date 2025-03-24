const fetch = require('node-fetch');
const GPS = require('../models/gps.models'); // Importa el modelo de GPS
const Transporte = require('../models/transporte.models'); // Importa el modelo Transporte
// Función para obtener la ubicación de un dispositivo GPS desde Flespi
const obtenerUbicacionDesdeFlespi = async (dispositivoId) => {
  try {
    // Verifica si el dispositivoId es válido
    if (!dispositivoId) {
      console.warn('⚠️ El dispositivoId no está definido.');
      return null; // No hacer nada si el dispositivoId no es válido
    }

    // Busca el dispositivo GPS en la base de datos
    const gps = await GPS.findOne({ dispositivoId });
    if (!gps) {
      console.warn(`⚠️ El dispositivo con ID ${dispositivoId} no está registrado en la base de datos.`);
      return null; // No hacer nada si el dispositivo no está registrado
    }

    // Obtén el token desde la base de datos
    const tokenFlespi = gps.tokenFlespi;

    // Construye la URL de Flespi
    const FLESPI_URL = `https://flespi.io/gw/devices/${dispositivoId}/messages`;

    // Realiza la solicitud a Flespi
    const response = await fetch(FLESPI_URL, {
      method: 'GET',
      headers: {
        Authorization: `FlespiToken ${tokenFlespi}`, // Usa el token específico del dispositivo
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.result && data.result.length > 0) {
      // Ordena los mensajes por timestamp en orden descendente y toma el más reciente
      const mensajeMasReciente = data.result.sort((a, b) => b.timestamp - a.timestamp)[0];

      // Extrae las coordenadas del mensaje más reciente
      const position_latitude = mensajeMasReciente['position.latitude'];
      const position_longitude = mensajeMasReciente['position.longitude'];

      if (position_latitude !== undefined && position_longitude !== undefined) {
        return { latitud: position_latitude, longitud: position_longitude, tipo: 'gps_transporte' };
      } else {
        console.warn(`⚠️ Las coordenadas no están disponibles para el dispositivo con ID ${dispositivoId}.`);
        return null;
      }
    }

    console.warn(`⚠️ No se encontraron datos para el dispositivo con ID ${dispositivoId}.`);
    return null; // Si no hay datos disponibles
  } catch (error) {
    console.error('Error al obtener datos desde Flespi:', error);
    return null; // Maneja el error sin detener el servidor
  }
};

// Función para iniciar la consulta periódica
const iniciarConsultaPeriodica = (io) => {
  setInterval(async () => {
    try {
      // Obtén todos los dispositivos registrados en la base de datos
      const dispositivos = await GPS.find();
      if (dispositivos.length === 0) {
        console.warn('⚠️ No hay dispositivos GPS registrados en la base de datos.');
        return; // No hacer nada si no hay dispositivos
      }

      // Procesa cada dispositivo
      for (const dispositivo of dispositivos) {
        const ubicacion = await obtenerUbicacionDesdeFlespi(dispositivo.dispositivoId);

        if (ubicacion) {
          // Busca el transporte relacionado con el GPS
          const transporte = await Transporte.findOne({ gpsId: dispositivo._id }).select('nombre').lean();

          if (!transporte) {
            console.warn(`⚠️ No se encontró un transporte relacionado con el dispositivo ${dispositivo.dispositivoId}.`);
            continue; // Si no hay transporte relacionado, pasa al siguiente dispositivo
          }

                    console.log(`🚀 Enviando ubicación actualizada para el dispositivo ${dispositivo.dispositivoId}:`, ubicacion, transporte.nombre);

          // Emitir la ubicación junto con el nombre del transporte
          io.emit('ubicacionActualizada', {
            dispositivoId: dispositivo.dispositivoId,
            ...ubicacion,
            nombreTransporte: transporte.nombre, // Incluye el nombre del transporte
          });
        }
      }
    } catch (error) {
      console.error('Error en la consulta periódica:', error);
    }
  }, 5000); // Consulta cada 5 segundos
};

module.exports = {
  obtenerUbicacionDesdeFlespi,
  iniciarConsultaPeriodica,
};