import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate
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
  const [userLocation, setUserLocation] = useState(null);  // Estado para guardar la ubicación del usuario

  const navigate = useNavigate();  // Crea una instancia de useNavigate

  // Usamos useRef para mantener una referencia del contenedor del mapa
  const mapRef = useRef(null);

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
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  useEffect(() => {
    // Verifica si el mapa ya ha sido inicializado
    if (mapRef.current && userLocation) {
      const map = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 13); // Inicializa el mapa en la ubicación del usuario

      // Carga el mapa con OpenStreetMap como capa base
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      // Aquí puedes agregar el marcador y manipular el mapa según sea necesario
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setFormData({
          ...formData,
          ubicacion: { latitud: lat, longitud: lng },
        });
        // Añadir un marcador en la posición seleccionada
        L.marker([lat, lng]).addTo(map);
      });

      // Limpiar mapa cuando el componente se desmonte
      return () => {
        map.remove();
      };
    }
  }, [userLocation]); // Se ejecuta cada vez que la ubicación del usuario cambia

  // Función para manejar cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, ubicacion: { ...formData.ubicacion, [name]: value } });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Obtén el token desde el almacenamiento local
      const token = localStorage.getItem('admin_token');

      // Configura los encabezados con el token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token en el encabezado Authorization
        },
      };

      // Envía la solicitud con el token
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

        {/* El contenedor del mapa */}
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
