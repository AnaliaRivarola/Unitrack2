import React, { useEffect, useState, useRef, useMemo } from "react";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
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
import throttle from "lodash.throttle";





const socket = io("http://localhost:5000", {
  transports: ["websocket"], // Fuerza el uso de WebSockets
});

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
      map.flyTo(center, 17, { duration: 1.5 });
    }
  }, [center, map]);

  return null;
};

// Función para calcular la distancia usando Haversine
const haversineDistance = (coords1, coords2) => {
  const R = 6371e3; // Radio de la Tierra en metros
  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const lat1 = toRadians(coords1.lat);
  const lat2 = toRadians(coords2.lat);
  const deltaLat = toRadians(coords2.lat - coords1.lat);
  const deltaLng = toRadians(coords2.lng - coords1.lng);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distancia en metros
};

export const MapView = () => {
  const [pronostico, setPronostico] = useState([]);
    const [position, setPosition] = useState({
    lat: null,
    lng: null,
    nombreTransporte: "",
    transporteDisponible: false, // Indica si hay un transporte disponible
  });
  const [noData, setNoData] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [studentLocation, setStudentLocation] = useState(null);
  const [stops, setStops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [accuracy, setAccuracy] = useState(0); // Estado para la precisión

  // 📌 Estado para manejar el mensaje recibido del chofer
  const [mensajeChofer, setMensajeChofer] = useState("");
  const [showMensajeModal, setShowMensajeModal] = useState(false);
  
  // Eliminamos el estado y la lógica de `selectedTransporte`
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const markerRef = useRef(null); // Ref para el marcador

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
        const response = await axios.get("https://unitrack2.onrender.com/api/paradas");
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
    
      if (
        data &&
        typeof data.latitud === "number" &&
        typeof data.longitud === "number" &&
        data.nombreTransporte // Verifica que el transporte tenga un nombre
      ) {
        console.log("✅ Actualizando ubicación del transporte...");
        const newPosition = {
          lat: data.latitud,
          lng: data.longitud,
          nombreTransporte: data.nombreTransporte,
          transporteDisponible: true, // Indica que hay un transporte disponible
        };
        setPosition(newPosition);
        setNoData(false);
        setLastUpdate(Date.now());
    
        // Actualiza directamente la posición del marcador
        if (markerRef.current) {
          markerRef.current.setLatLng(newPosition);
        }
      } else {
        console.error("⚠️ Datos de transporte incompletos o inválidos:", data);
        setPosition({ lat: null, lng: null, nombreTransporte: "", transporteDisponible: false }); // No hay transporte disponible
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

  useEffect(() => {
    const updatePosition = throttle((data) => {
      if (data && typeof data.latitud === "number" && typeof data.longitud === "number") {
        setPosition({ lat: data.latitud, lng: data.longitud });
      }
    }, 1000); // Actualiza como máximo una vez por segundo
  
    socket.on("ubicacionActualizada", updatePosition);
  
    return () => {
      socket.off("ubicacionActualizada", updatePosition);
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
  const fetchPronostico = async () => {
    try {
      const { lat, lng } = studentLocation;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=909b15c8c85de82c205511363a243ec7`
      );

      const ahora = new Date();

      const proximos = response.data.list
        .map((item) => {
          const fechaUTC = new Date(item.dt_txt);
          return {
            ...item,
            localDate: new Date(fechaUTC.getTime() - fechaUTC.getTimezoneOffset() * 60000)
          };
        })
        .filter((item) => item.localDate > ahora)
        .slice(0, 2); // Primeros dos que aún no ocurrieron localmente

      setPronostico(proximos);
    } catch (err) {
      console.error("❌ Error al obtener el pronóstico:", err);
    }
  };

  if (studentLocation?.lat && studentLocation?.lng) {
    fetchPronostico();
  }
}, [studentLocation]);




  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log(`Ubicación obtenida: Latitud: ${latitude}, Longitud: ${longitude}, Precisión: ${accuracy} metros`);
          setStudentLocation({ lat: latitude, lng: longitude });
          setPosition({ lat: latitude, lng: longitude });
          setAccuracy(accuracy); // Guarda la precisión en el estado
        },
        (err) => {
          console.error("No se pudo obtener la ubicación", err);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
        }
      );
    } else {
      alert("Geolocalización no soportada por este navegador");
    }
  }, []);

  useEffect(() => {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted") {
        console.log("Permiso concedido para acceder a la ubicación.");
      } else if (result.state === "prompt") {
        console.log("El navegador pedirá permiso para acceder a la ubicación.");
      } else if (result.state === "denied") {
        console.log("Permiso denegado. Pide al usuario que lo habilite manualmente.");
      }
    });
  }, []);

  useEffect(() => {
    if (studentLocation && position) {
      const distance = haversineDistance(studentLocation, position);
      console.log("Distancia calculada:", distance, "metros");
      setIsButtonEnabled(distance <= 3000); // Habilita si está a 100 metros o menos
    }
  }, [studentLocation, position]);

  const stopMarkers = useMemo(() => {
    return stops.map((stop) => (
      <Marker key={stop._id} position={[stop.ubicacion.latitud, stop.ubicacion.longitud]} icon={stopIcon}>
        <Popup>Nombre: {stop.nombre}</Popup>
      </Marker>
    ));
  }, [stops]);

  return (
    <>
     <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
    <div>
      <ChoferEsperaModal show={showModal} setShow={setShowModal} />
      
      {/* 📌 Modal para mostrar mensajes del chofer */}
      <MensajeModal 
        show={showMensajeModal} 
        handleClose={() => setShowMensajeModal(false)} 
        mensaje={mensajeChofer} 
      />

      <MapContainer key={`${position.lat}-${position.lng}`} center={position} zoom={70} style={{ height: "calc(100vh - 60px)", width: "100%" }}>
        <Sidebar />
        <ChangeView center={position} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
                {position.transporteDisponible && (
          <Marker position={position} icon={busIcon} ref={markerRef}>
            <Popup>
              {noData
                ? "⚠️ Sin actualización de ubicación"
                : `🚍  Nombre del Transporte: ${position.nombreTransporte}`}
            </Popup>
          </Marker>
        )}


        {studentLocation && (
          <>
          <Marker position={studentLocation} icon={studentLocationIcon}>
            <Popup>{"Tu estás aquí!"}</Popup>
          </Marker>

          </>
        )}

        {stopMarkers}
      </MapContainer>
                <button
                  title="Solo podés enviar si estás cerca del transporte"
                  onClick={handleSendLocation}
                  className="floating-button"
                  disabled={!isButtonEnabled}
                >
                  Enviar mi ubicación
                </button>


<div className="temperatura-widget">
  {pronostico.length === 0 ? (
    <p>🌤️ Cargando pronóstico...</p>
  ) : (
    pronostico.map((item, i) => (
      <div key={item.dt_txt} className="weather-card">
        <img
          src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
          alt="icono"
        />
        <div>
          <strong>🌡️ {Math.round(item.main.temp)}°C</strong>
          <p className="desc">🌤️ {item.weather[0].description}</p>
          <p className="hora">
            🕒 {i === 0 ? "Ahora" : item.localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    ))
  )}
</div>





<div className="map-legend">
  <div><img src={markerIcon} alt="Bus" /> Transporte</div>
  <div><img src={studentIcon} alt="Estudiante" /> Estudiante</div>
  <div><img src={paradaIcon} alt="Parada" /> Parada</div>
</div>

      <Footer />
    </div>

    </>
  );
};
