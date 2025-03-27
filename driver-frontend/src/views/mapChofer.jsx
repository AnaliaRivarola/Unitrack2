import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";
import L from "leaflet";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';
import markerIcon from "../assets/icono2.png";
import studentIcon from "../assets/student.png";
import StudentLocationModal from "../components/modal/StudentLocationModal.jsx"; // Modal incluido
import paradaIcon from "../assets/parada.png";
import '../styles/mapChofer.css';
import axios from "axios";

const socket = io("http://localhost:5000");

const busIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [27, 50],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const studentMarker = L.icon({
  iconUrl: studentIcon,
  iconSize: [40, 40],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

const paradaMarker = L.icon({
  iconUrl: paradaIcon,
  iconSize: [30, 40],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.setView(center);
    }
  }, [center, map]);

  return null;
};

export const MapView = () => {
  const [busPosition, setBusPosition] = useState({ lat: -27.333, lng: -55.866 });
  const [studentPosition, setStudentPosition] = useState(null);
  const [noData, setNoData] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [studentData, setStudentData] = useState(null); // Datos del estudiante para el modal
  const navigate = useNavigate();
  const [paradas, setParadas] = useState([]); // Inicializa como un array vacío

  const fetchParadas = async () => {
    try {
      const token = localStorage.getItem('driver_token');
      console.log('Llamando a /api/chofer/paradas con token:', token);
      const response = await axios.get('http://localhost:5000/api/chofer/paradas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Respuesta del servidor:', response.data);

      // Accede a response.data.paradas
      if (Array.isArray(response.data.paradas)) {
        setParadas(response.data.paradas); // Establece las paradas en el estado
      } else {
        console.error('El servidor no devolvió un array de paradas:', response.data);
        setParadas([]); // Establece un array vacío si no es válido
      }
    } catch (error) {
      console.error('Error al obtener las paradas:', error.response || error.message);
      alert('No se pudieron cargar las paradas. Por favor, intenta nuevamente.');
      setParadas([]); // Establece un array vacío en caso de error
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('driver_rol');
    localStorage.removeItem('driver_token');
    localStorage.removeItem('rol');
    localStorage.removeItem('token');
    
    navigate('/login');
  };

  useEffect(() => {
    const timeout = setInterval(() => {
      if (Date.now() - lastUpdate > 30000) {
        setNoData(true);
      }
    }, 10000);

        socket.on("ubicacionActualizada", (data) => {
      console.log("Ubicación actualizada recibida:", data);
      if (data.tipo === "gps_transporte") {
        if (data.latitud && data.longitud) {
          setBusPosition({ lat: data.latitud, lng: data.longitud });
          setNoData(false);
          setLastUpdate(Date.now());
        }
      }
    });
    
    socket.on("ubicacionEstudiante", (data) => {
      console.log("Ubicación del estudiante recibida:", data);
      if (data.tipo === "ubicacion_estudiante") {
        if (data.latitud && data.longitud) {
          setStudentPosition({ lat: data.latitud, lng: data.longitud });
          setStudentData(data); // Guarda los datos del estudiante
          setShowModal(true); // Muestra el modal
        }
      }
    });

    return () => {
      socket.off("ubicacionActualizada");
      socket.off("ubicacionEstudiante");
      clearInterval(timeout);
    };
  }, [lastUpdate]);

  useEffect(() => {
    fetchParadas(); // Llama a la función para obtener las paradas
  }, []);

    useEffect(() => {
    console.log("Estado del modal (showModal):", showModal);
  }, [showModal]);
  return (
    <div className="d-flex flex-column vh-100">
      {/* Navbar con el botón de cerrar sesión */}
      <Navbar logoSrc="../src/assets/driver2.png" altText="Logo">
        <button onClick={handleLogout} className="btn btn-danger ms-auto">
          Cerrar Sesión
        </button>
      </Navbar>

      {/* Contenedor principal con el mapa */}
      <div className="flex-grow-1 position-relative">
        <MapContainer center={busPosition} zoom={15} style={{ height: "100%", width: "100%" }}>
          <ChangeView center={busPosition} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={busPosition} icon={busIcon}>
            <Popup>
              {noData ? "⚠️ Sin actualización de ubicación" : "🚍 Bus en movimiento"}
            </Popup>
          </Marker>

          {studentPosition && (
            <Marker position={studentPosition} icon={studentMarker}>
              <Popup>🎒 Estudiante aquí</Popup>
            </Marker>
          )}

          {paradas.length > 0 ? (
            paradas.map((parada) => (
              parada.latitud && parada.longitud && ( // Validar que existan las coordenadas
                <Marker
                  key={parada._id}
                  position={{ lat: parada.latitud, lng: parada.longitud }}
                  icon={paradaMarker}
                >
                  <Popup>{parada.nombre}</Popup>
                </Marker>
              )
            ))
          ) : (
            <p>No hay paradas disponibles</p> // Mensaje para cuando no hay datos
          )}
        </MapContainer>
        {/* Botón flotante para enviar mensajes */}
        <button
          onClick={() => navigate("/chofer/mensajes")}
          className="floating-button">
          Enviar Mensaje
        </button>
      </div>

      {/* Modal para mostrar la ubicación del estudiante */}
      {showModal && (
      <StudentLocationModal
        showModal={showModal} // Estado para mostrar el modal
        setShowModal={setShowModal} // Función para cerrar el modal
        studentData={studentData} // Datos del estudiante
        setShowChoferModal={() => {}} // Si tienes otro modal, pasa esta función
      />
    )}

      <Footer />
    </div>
  );
};
