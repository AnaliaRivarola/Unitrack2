import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";
import L from "leaflet";
import markerIcon from "../assets/icono2.png"; 

const socket = io("http://localhost:5000"); // Verifica si el backend está corriendo

const busIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [27, 50],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
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

  useEffect(() => {
    socket.on("ubicacionActualizada", (data) => {
      console.log("📍 Nueva ubicación recibida:", data);

      // Verificar que data contiene latitud y longitud válidas
      if (data.latitud && data.longitud) {
        setPosition((prevPos) => {
          if (prevPos.lat !== data.latitud || prevPos.lng !== data.longitud) {
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
    };
  }, []);

  return (
    <MapContainer key={`${position.lat}-${position.lng}`} center={position} zoom={15} style={{ height: "100vh", width: "100%" }}>
      <ChangeView center={position} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={busIcon}>
        <Popup>🚍 Transporte en tiempo real</Popup>
      </Marker>
    </MapContainer>
  );
};
