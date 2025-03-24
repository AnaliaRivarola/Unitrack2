import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Importar useNavigate
import { Modal, Button } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";
import L from "leaflet";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';
import markerIcon from "../assets/icono2.png";
import studentIcon from "../assets/student.png";
import StudentLocationModal from "../components/modal/StudentLocationModal.jsx";
import '../styles/mapChofer.css';


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
  const [showModal, setShowModal] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate(); // ✅ Hook para la navegación

  useEffect(() => {
    const timeout = setInterval(() => {
      if (Date.now() - lastUpdate > 30000) {
        setNoData(true);
      }
    }, 10000);

    socket.on("ubicacionActualizada", (data) => {
      if (data.tipo === "gps_transporte") {
        if (data.latitud && data.longitud) {
          setBusPosition({ lat: data.latitud, lng: data.longitud });
          setNoData(false);
          setLastUpdate(Date.now());
        }
      }
    });

    socket.on("ubicacionEstudiante", (data) => {
      if (data.tipo === "ubicacion_estudiante") {
        if (data.latitud && data.longitud) {
          setStudentPosition({ lat: data.latitud, lng: data.longitud });
          setStudentData(data);
          setShowModal(true);
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
    <>
    <Navbar logoSrc="../src/assets/driver2.png" altText="Logo" />
    <div>
      <MapContainer center={busPosition} zoom={15} style={{ height: "100vh", width: "100%" }}>
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
      </MapContainer>

      <StudentLocationModal showModal={showModal} setShowModal={setShowModal} studentData={studentData} />

      {/* ✅ Botón para ir a /chofer/mensajes */}
      <button onClick={() => navigate("/chofer/mensajes")} className="floating-button">
        Enviar Mensaje
      </button>
    </div>
    <Footer />
    </>
  );
};
