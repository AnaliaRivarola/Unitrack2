import React, { useEffect, useState } from "react";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";
import L from "leaflet";
import { Modal, Button } from "react-bootstrap";
import ChoferEsperaModal from "../components/modal/choferEspera";
import markerIcon from "../assets/icono2.png"; 
import studentIcon from "../assets/student.png"; 
import paradaIcon from "../assets/parada.png";
import Sidebar from "./sideBar"; // Importa el sidebar
import '../styles/mapa.css';  // Importa el archivo CSS
import axios from "axios";  // Asegúrate de importar axios para las solicitudes HTTP

const socket = io("http://localhost:5000");

const busIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [27, 55],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

// Icono personalizado para la ubicación del estudiante
const studentLocationIcon = L.icon({
  iconUrl: studentIcon,  
  iconSize: [30, 30],  
  iconAnchor: [15, 15], 
  popupAnchor: [0, -15] 
});

// Icono personalizado para las paradas
const stopIcon = L.icon({
  iconUrl: paradaIcon, // Reemplázalo con el icono que desees
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
  const [position, setPosition] = useState({ lat: -27.333, lng: -55.866 });
  const [noData, setNoData] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [studentLocation, setStudentLocation] = useState(null);
  const [stops, setStops] = useState([]); // Estado para almacenar las paradas]
  const [showModal, setShowModal] = useState(false);

  //chofer espera 
  useEffect(() => {
    socket.on("choferEsperara", () => {
      console.log("Evento 'choferEsperara' recibido");
      setShowModal(true);  // Mostrar el modal cuando el chofer confirme
    });
  
    return () => {
      socket.off("choferEsperara");
    };
  }, []);

  // Obtener las paradas desde el backend
  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/paradas"); // Ajusta la URL según tu API
        setStops(response.data); // Asume que la API devuelve un array de paradas
      } catch (error) {
        console.error("Error al obtener las paradas:", error);
      }
    };

    fetchStops(); // Llamada para obtener las paradas al cargar el componente
  }, []);

  useEffect(() => {
    const timeout = setInterval(() => {
      if (Date.now() - lastUpdate > 30000) {
        setNoData(true);
      }
    }, 10000);

    socket.on("ubicacionActualizada", (data) => {
      console.log("📍 Nueva ubicación recibida:", data);
      if (data.latitud && data.longitud) {
        setPosition((prevPos) => {
          if (prevPos.lat !== data.latitud || prevPos.lng !== data.longitud) {
            setNoData(false);
            setLastUpdate(Date.now());
            return { lat: data.latitud, lng: data.longitud };
          }
          return prevPos;
        });
      } else {
        console.error("⚠️ Datos inválidos recibidos:", data);
      }
    });

    return () => {
      socket.off("ubicacionActualizada");
      clearInterval(timeout);
    };
  }, [lastUpdate]);

  const handleSendLocation = () => {
    if (navigator.geolocation) {
      console.log("Solicitando ubicación...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("🎒 Ubicación del estudiante obtenida:", { lat: latitude, lng: longitude });
  
          setStudentLocation({ lat: latitude, lng: longitude }); 
  
          // Enviar la ubicación al servidor con identificador
          socket.emit("ubicacionEstudiante", {
            latitud: latitude,
            longitud: longitude,
            tipo: "ubicacion_estudiante" // 🔹 Identificador para la ubicación del estudiante
          });
  
          console.log("🚀 Ubicación del estudiante enviada al conductor:", { lat: latitude, lng: longitude });
        },
        (err) => {
          console.error("No se pudo obtener la ubicación", err);
        }
      );
    } else {
      console.log("Geolocalización no soportada por este navegador");
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log(`Ubicación obtenida: Latitud: ${latitude}, Longitud: ${longitude}, Precisión: ${accuracy} metros`);
          setStudentLocation({ lat: latitude, lng: longitude });
          setPosition({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error("No se pudo obtener la ubicación", err);
        },
        {
          enableHighAccuracy: true,  // Habilita la mayor precisión posible
          timeout: 10000,            // Establece un tiempo de espera
          maximumAge: 0              // Evita que use una ubicación en caché
        }
      );
    } else {
      alert("Geolocalización no soportada por este navegador");
    }
  }, []);

  return (
    <div>
      {/*<Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />*/}
      <ChoferEsperaModal show={showModal} setShow={setShowModal} />
      <MapContainer key={`${position.lat}-${position.lng}`} center={position} zoom={15} style={{ height: "calc(100vh - 60px)", width: "100%" }}>
        <Sidebar />
        <ChangeView center={position} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={busIcon}>
          <Popup>
            {noData ? "⚠️ Sin actualización de ubicación" : "🚍 Transporte en tiempo real"}
          </Popup>
        </Marker>
        
        {/* Mostrar la ubicación del estudiante en el mapa */}
        {studentLocation && (
          <Marker position={studentLocation} icon={studentLocationIcon}>
            <Popup>
              {"Tu estas aqui!"}
              <br />
              {"Que te vaya bien en tus clases el dia de hoy"}
            </Popup>
          </Marker>
        )}

        {/* Mostrar las paradas en el mapa */}
        {stops.map((stop) => (
          <Marker key={stop._id} position={[stop.ubicacion.latitud, stop.ubicacion.longitud]} icon={stopIcon}>
            <Popup>Nombre: {stop.nombre}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Botón flotante */}
      <button onClick={handleSendLocation} className="floating-button">
        Enviar mi ubicación
      </button>

      <Footer />
    </div>
  );
};
