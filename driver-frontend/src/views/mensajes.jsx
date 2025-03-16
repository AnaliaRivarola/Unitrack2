import React, { useState } from "react";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mensajes.css";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

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
  const [mensajeEnviado, setMensajeEnviado] = useState(""); // Estado para el mensaje de confirmación
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  // Función para enviar el mensaje y redirigir al mapa después de unos segundos
  const handleSendMessage = (mensaje) => {
    socket.emit("mensaje-conductor", mensaje);
    setMensajeEnviado("¡Mensaje enviado!"); // Muestra el mensaje de confirmación

    // Después de 2 segundos, redirige al mapa
    setTimeout(() => {
      navigate("/chofer/mapa");
    }, 2000); // Redirige después de 2 segundos
  };

  return (
    <div className="mensajes-container">
      <h2>Mensajes Rápidos</h2>
      {mensajeEnviado && (
        <div className="alert alert-success mt-3" role="alert">
          {mensajeEnviado}
        </div>
      )}
      <div className="d-flex flex-column gap-3">
        {mensajes.map((mensaje, index) => (
          <button
            key={index}
            className="mensaje-btn"
            onClick={() => handleSendMessage(mensaje)} // Llama a handleSendMessage
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
          onClick={() => handleSendMessage(mensajePersonalizado)} // Llama a handleSendMessage
        >
          Enviar mensaje
        </button>
      </div>

      {/* Muestra el mensaje de confirmación */}
     
    </div>
  );
};
