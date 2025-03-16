import React, { useState } from "react";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mensajes.css";

const socket = io("http://localhost:5000");

export const MensajesRapidos = () => {
  const mensajes = [
    "Estoy un poco atrasado",
    "Hay mucho tráfico en la ruta",
    "Hubo un desvío inesperado",
    "El bus está lleno",
    "Tengo problemas con el bus",
    "Hoy no saldrá el bus",
  ];

  const [mensajePersonalizado, setMensajePersonalizado] = useState("");

  // Asegúrate de que esta sea la función correcta
  const handleSendMessage = (mensaje) => {
    socket.emit("mensaje-conductor", mensaje);
  };

  return (
    <div className="mensajes-container">
      <h2>Mensajes Rápidos</h2>
      <div className="d-flex flex-column gap-3">
        {mensajes.map((mensaje, index) => (
          <button
            key={index}
            className="mensaje-btn"
            onClick={() => handleSendMessage(mensaje)} // Aquí cambia a handleSendMessage
          >
            {mensaje}
          </button>
        ))}
      </div>

      {/* Campo para mensaje personalizado */}
      <div className="custom-message-container mt-4">
        <input
          type="text"
          className="form-control"
          placeholder="Escribe tu mensaje..."
          value={mensajePersonalizado}
          onChange={(e) => setMensajePersonalizado(e.target.value)}
        />
        <button
          className="mensaje-btn mt-2"
          onClick={() => handleSendMessage(mensajePersonalizado)} // Aquí también cambia a handleSendMessage
        >
          Enviar mensaje
        </button>
      </div>
    </div>
  );
};
