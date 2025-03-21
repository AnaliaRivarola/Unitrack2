const express = require("express");
const router = express.Router();
const TransporteController = require("../controllers/TransporteController");
const Transporte = require("../models/transporte.models");
const { authenticateJWT, verifyRole } = require('../middlewares/authMiddleware');
// Crear un transporte
router.get("/transportes", async (req, res) => {
  console.log("Solicitud recibida en /transportes");
  try {
    const transportes = await Transporte.find();
    res.json(transportes);
  } catch (error) {
    console.error("Error al obtener transportes:", error);
    res.status(500).json({ message: "Error del servidor al obtener transportes" });
  }
});

// Obtener todos los transportes
router.get("/transportes", async (req, res) => {
  try {
    const transportes = await Transporte.find();
    res.json(transportes);
  } catch (error) {
    console.error("Error al obtener transportes:", error);
    res.status(500).json({ message: "Error del servidor al obtener transportes" });
  }
});

// 📌 👇 Cambiamos `/:id` a `/transportes/:id` para evitar capturas incorrectas
router.get("/transportes/:id", TransporteController.getTransporteById);
router.put("/transportes/:id",  authenticateJWT, verifyRole(['admin', 'superadmin']), TransporteController.updateTransporte);
router.delete("/transportes/:id",  authenticateJWT, verifyRole(['admin', 'superadmin']), TransporteController.deleteTransporte);

// Ruta para asociar un GPS a un transporte
router.post('/asociar-gps', TransporteController.asociarGpsATransporte);

// Ruta para obtener un transporte con su GPS asociado
router.get('/:transporteId/gps', TransporteController.obtenerTransporteConGps);
module.exports = router;
