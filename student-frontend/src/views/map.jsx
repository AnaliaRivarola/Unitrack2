import React, { useEffect, useState } from "react";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";
import L from "leaflet";
import { Modal, Button } from "react-bootstrap";
import ChoferEsperaModal from "../components/modal/choferEspera";
import { MensajeModal } from "../components/modal/mensajeChofer"; // 📌 Importa el modal
import markerIcon from "../assets/icono2.png"; 
import studentIcon from "../assets/student.png"; 
import paradaIcon from "../assets/parada.png";
import Sidebar from "./sideBar"; 
import '../styles/mapa.css';  
import axios from "axios";  
import { useParams } from "react-router-dom";


const socket = io("http://localhost:5000");

const busIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [27, 55],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const studentLocationIcon = L.icon({
  iconUrl: studentIcon,  
  iconSize: [30, 30],  
  iconAnchor: [15, 15], 
  popupAnchor: [0, -15] 
});

const stopIcon = L.icon({
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
  const [position, setPosition] = useState({ lat: -27.333, lng: -55.866 });
  const [noData, setNoData] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [studentLocation, setStudentLocation] = useState(null);
  const [stops, setStops] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // 📌 Estado para manejar el mensaje recibido del chofer
  const [mensajeChofer, setMensajeChofer] = useState("");
  const [showMensajeModal, setShowMensajeModal] = useState(false);

  // Eliminamos el estado y la lógica de `selectedTransporte`

  useEffect(() => {
    socket.on("choferEsperara", () => {
      console.log("Evento 'choferEsperara' recibido");
      setShowModal(true);
    });
  
    return () => {
      socket.off("choferEsperara");
    };
  }, []);

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/paradas");
        setStops(response.data);
      } catch (error) {
        console.error("Error al obtener las paradas:", error);
      }
    };

    fetchStops();
  }, []);

  useEffect(() => {
    const timeout = setInterval(() => {
      if (Date.now() - lastUpdate > 30000) {
        setNoData(true); // Si han pasado más de 30 segundos sin actualización
      }
    }, 10000); // Se ejecuta cada 10 segundos
  
    socket.on("ubicacionActualizada", (data) => {
      console.log("📍 Nueva ubicación recibida:", data);
  
      if (!data) {
        console.error("❌ Error: No se recibió ningún dato en 'ubicacionActualizada'.");
        return;
      }
  
      console.log("🔍 Claves disponibles en data:", Object.keys(data));

  
      if (typeof data.latitud === "number" && typeof data.longitud === "number") {
        console.log("✅ Actualizando ubicación del transporte...");
        setPosition({
          lat: data.latitud,
          lng: data.longitud,
        });
        setNoData(false);
        setLastUpdate(Date.now());
      } else {
        console.error("⚠️ Datos de ubicación incompletos o inválidos:", data);
      }
    });
  
    return () => {
      socket.off("ubicacionActualizada");
    };
  }, [lastUpdate]);

  useEffect(() => {
    console.log("🚍 Mapa actualizado");
  }, [position]);

  useEffect(() => {
    socket.on("mensaje-estudiante", (mensaje) => {
      console.log("📨 Mensaje recibido del chofer:", mensaje);
      setMensajeChofer(mensaje);
      setShowMensajeModal(true);
    });
  
    return () => {
      socket.off("mensaje-estudiante");
    };
  }, []);

  const handleSendLocation = () => {
    if (navigator.geolocation) {
      console.log("Solicitando ubicación...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("🎒 Ubicación del estudiante obtenida:", { lat: latitude, lng: longitude });
  
          setStudentLocation({ lat: latitude, lng: longitude }); 
          socket.emit("ubicacionEstudiante", {  
            latitud: latitude,
            longitud: longitude,
            tipo: "ubicacion_estudiante"
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
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert("Geolocalización no soportada por este navegador");
    }
  }, []);

  return (
    <div>
      <ChoferEsperaModal show={showModal} setShow={setShowModal} />
      
      {/* 📌 Modal para mostrar mensajes del chofer */}
      <MensajeModal 
        show={showMensajeModal} 
        handleClose={() => setShowMensajeModal(false)} 
        mensaje={mensajeChofer} 
      />

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

        {studentLocation && (
          <Marker position={studentLocation} icon={studentLocationIcon}>
            <Popup>{"Tu estás aquí!"}</Popup>
          </Marker>
        )}

        {stops.map((stop) => (
          <Marker key={stop._id} position={[stop.ubicacion.latitud, stop.ubicacion.longitud]} icon={stopIcon}>
            <Popup>Nombre: {stop.nombre}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <button onClick={handleSendLocation} className="floating-button">
        Enviar mi ubicación
      </button>

      <Footer />
    </div>
  );
};
