import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap"; // Importar Bootstrap
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';
import StudentLocationModal from "../components/modal/StudentLocationModal.jsx"; // Importar el modal
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";
import L from "leaflet";
import markerIcon from "../assets/icono2.png"; // Icono del bus
import studentIcon from "../assets/student.png"; // Asegúrate de agregar un ícono diferente para el estudiante

const socket = io("http://localhost:5000"); // Conexión al backend usando Socket.io


// Ícono del bus
const busIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [27, 50],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

// Ícono del estudiante
const studentMarker = L.icon({
  iconUrl: studentIcon,
  iconSize: [40, 40],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.setView(center); // Cambia la vista del mapa
    }
  }, [center, map]);

  return null;
};

export const MapView = () => {
  const [busPosition, setBusPosition] = useState({ lat: -27.333, lng: -55.866 }); // Coordenadas del bus
  const [studentPosition, setStudentPosition] = useState(null); // Coordenadas del estudiante
  const [noData, setNoData] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [showModal, setShowModal] = useState(false);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {

    const timeout = setInterval(() => {
      if (Date.now() - lastUpdate > 30000) {
        setNoData(true);
      }
    }, 10000);
  
    // Escuchar la ubicación del BUS

    socket.on("ubicacionActualizada", (data) => {
      if (data.tipo === "gps_transporte") {
        console.log("🚌 Ubicación del transporte recibida:", data);
        if (data.latitud && data.longitud) {
          setBusPosition({ lat: data.latitud, lng: data.longitud });
          setNoData(false);
          setLastUpdate(Date.now());
        }
      }
    });

    // Escuchar la ubicación del ESTUDIANTE y solo loguear la información correspondiente
    socket.on("ubicacionEstudiante", (data) => {
      if (data.tipo === "ubicacion_estudiante") {
        console.log("🎒 Ubicación del estudiante recibida:", data);
        
        if (data.latitud && data.longitud) {
          setStudentPosition({ lat: data.latitud, lng: data.longitud });
          setStudentData(data); // Guardar datos para mostrar en el modal
          setShowModal(true); // Mostrar el modal
        }
      }
    });
  
    return () => {
      socket.off("ubicacionActualizada");
      socket.off("ubicacionEstudiante");
      clearInterval(timeout);
    };
  
  }, [lastUpdate]);
  
  return (
    <div>
       
      <MapContainer center={busPosition} zoom={15} style={{ height: "100vh", width: "100%" }}>
        <ChangeView center={busPosition} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Marcador del BUS */}
        <Marker position={busPosition} icon={busIcon}>
          <Popup>
            {noData ? "⚠️ Sin actualización de ubicación" : "🚍 Bus en movimiento"}
          </Popup>
        </Marker>

        {/* Marcador del ESTUDIANTE */}
        {studentPosition && (
          <Marker position={studentPosition} icon={studentMarker}>
            <Popup>🎒 Estudiante aquí</Popup>
          </Marker>
        )}
      </MapContainer>

      <StudentLocationModal 
      showModal={showModal} 
      setShowModal={setShowModal} 
      studentData={studentData} 
    />
    </div>
  );
};
