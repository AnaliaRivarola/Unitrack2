const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/contacto", async (req, res) => {
  const { nombre, correo, mensaje } = req.body;

  try {
    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
      service: "gmail", // Cambia esto si usas otro proveedor de correo
      auth: {
        user: "unitruck.soporte@gmail.com", // Tu correo electrónico
        pass: "yoot brni bmbp lnur", // Tu contraseña o app password
      },
    });

    // Configurar el contenido del correo
    const mailOptions = {
      from: correo,
      to: "unitruck.soporte@gmail.com", // Correo de soporte
      subject: `Nuevo mensaje de contacto de ${nombre}`,
      text: `Nombre: ${nombre}\nCorreo: ${correo}\nMensaje: ${mensaje}`,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ message: "Error al enviar el correo" });
  }
});

module.exports = router;