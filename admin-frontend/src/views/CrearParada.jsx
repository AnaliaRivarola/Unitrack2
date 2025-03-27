import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CrearParada.css';
import "leaflet/dist/leaflet.css";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';

export const CrearParada = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: { latitud: '', longitud: '' },
  });
  const [message, setMessage] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  const navigate = useNavigate();
  const mapRef = useRef(null);
  const markerRef = useRef(null); // Referencia para el marcador

  useEffect(() => {
    // Obtener la ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error al obtener la ubicación', error);
          setMessage('No se pudo obtener la ubicación.');
        }
      );
    } else {
      setMessage('Geolocalización no soportada en este navegador.');
    }
  }, []);

  useEffect(() => {
    // Inicializar el mapa y el marcador
    if (mapRef.current && userLocation) {
      const map = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 13);

      // Cargar el mapa con OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      // Crear un marcador inicial en la ubicación del usuario
      const marker = L.marker([userLocation.lat, userLocation.lng], { draggable: true }).addTo(map);
      markerRef.current = marker; // Guardar referencia al marcador

      // Actualizar el formulario cuando el marcador se mueva
      marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        setFormData({
          ...formData,
          ubicacion: { latitud: lat, longitud: lng },
        });
      });

      // Actualizar el marcador y el formulario al hacer clic en el mapa
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setFormData({
          ...formData,
          ubicacion: { latitud: lat, longitud: lng },
        });
        marker.setLatLng([lat, lng]); // Mover el marcador a la nueva ubicación
      });

      // Limpiar el mapa al desmontar el componente
      return () => {
        map.remove();
      };
    }
  }, [userLocation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, ubicacion: { ...formData.ubicacion, [name]: value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post('http://localhost:5000/api/paradas', formData, config);
      setMessage('Parada creada exitosamente.');
      setFormData({ nombre: '', ubicacion: { latitud: '', longitud: '' } });
      navigate('/admin/gestionar-paradas');
    } catch (error) {
      console.error('Error al crear la parada:', error.response ? error.response.data : error.message);
      setMessage('Hubo un error al crear la parada.');
    }
  };

  return (
    <>
      <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
      <div className="crear-parada-container">
        <h1>Crear Parada</h1>
        <form onSubmit={handleSubmit} className="crear-parada-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Parada</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          {/* Contenedor del mapa */}
          <div className="map-container" ref={mapRef} style={{ height: '400px' }}></div>

          {/* Campos para ingresar las coordenadas manualmente */}
          <div className="form-group">
            <label htmlFor="latitud">Latitud</label>
            <input
              type="text"
              id="latitud"
              name="latitud"
              value={formData.ubicacion.latitud}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="longitud">Longitud</label>
            <input
              type="text"
              id="longitud"
              name="longitud"
              value={formData.ubicacion.longitud}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Crear</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </>
  );
};
