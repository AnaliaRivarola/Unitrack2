const express = require('express');
const router = express.Router();
const gpsController = require('../controllers/gpsController'); // Importa el controlador de GPS

// Ruta para obtener la ubicación de un dispositivo GPS
router.get('/gps/:id/ubicacion', gpsController.getUbicacion);

// Ruta para registrar un nuevo dispositivo GPS
router.post('/gps', gpsController.createGps);

// Ruta para eliminar un dispositivo GPS
router.delete('/gps/:id', gpsController.deleteGps);

// Ruta para obtener todos los dispositivos GPS
router.get('/', gpsController.getAllGps);

module.exports = router;