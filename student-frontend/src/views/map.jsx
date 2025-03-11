import React, { useEffect, useState } from "react";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";
import L from "leaflet";
import markerIcon from "../assets/icono2.png"; 
import studentIcon from "../assets/student.png"; 
import Sidebar from "./sideBar"; // Importa el sidebar
import '../styles/mapa.css';  // Importa el archivo CSS

const socket = io("http://localhost:5000");

const busIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [27, 50],
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
          console.log("Ubicación del estudiante obtenida:", { lat: latitude, lng: longitude });
          setStudentLocation({ lat: latitude, lng: longitude }); // Actualizar la ubicación del estudiante

          socket.emit("ubicacionEstudiante", {
            latitud: latitude,
            longitud: longitude,
          });
          console.log("Ubicación enviada al conductor:", { lat: latitude, lng: longitude });
        },
        (err) => {
          console.error("No se pudo obtener la ubicación", err);
        }
      );
    } else {
      console.log("Geolocalización no soportada por este navegador");
      alert("Geolocalización no soportada por este navegador");
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
      <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
      
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
            <Popup>Ubicación del Estudiante</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Botón flotante */}
      <button onClick={handleSendLocation} className="floating-button">
        Enviar mi ubicación
      </button>

      <Footer />
    </div>
  );
};
