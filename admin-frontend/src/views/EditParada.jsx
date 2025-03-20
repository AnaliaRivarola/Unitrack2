import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet'; // Asegúrate de importar Leaflet para el mapa
import '../styles/CrearParada.css'; // Asegúrate de que los estilos sean los mismos
import "leaflet/dist/leaflet.css";

export const EditParada = () => {
  const { id } = useParams(); // Obtener el id de la parada desde la URL
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: { latitud: '', longitud: '' }, // Estructura del estado para latitud y longitud
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const mapRef = useRef(null); // Referencia al contenedor del mapa

  // Obtener los datos de la parada al montar el componente
  useEffect(() => {
    const fetchParada = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/paradas/${id}`);
        setFormData({
          nombre: response.data.nombre,
          ubicacion: {
            latitud: response.data.ubicacion.latitud,
            longitud: response.data.ubicacion.longitud,
          },
        });
      } catch (error) {
        console.error('Error al obtener la parada:', error);
        setMessage('Hubo un error al obtener la parada.');
      }
    };

    fetchParada();
  }, [id]);

  useEffect(() => {
    // Verifica si el mapa ya ha sido inicializado
    if (mapRef.current && formData.ubicacion.latitud && formData.ubicacion.longitud) {
      const map = L.map(mapRef.current).setView([formData.ubicacion.latitud, formData.ubicacion.longitud], 13); // Inicializa el mapa en la ubicación de la parada

      // Carga el mapa con OpenStreetMap como capa base
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      // Añadir un marcador en la ubicación de la parada
      const marker = L.marker([formData.ubicacion.latitud, formData.ubicacion.longitud]).addTo(map);

      // Aquí se actualizará la ubicación en el formulario cuando el usuario haga clic en el mapa
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setFormData({
          ...formData,
          ubicacion: { latitud: lat, longitud: lng },
        });

        // Mover el marcador a la nueva ubicación
        marker.setLatLng([lat, lng]);
      });

      // Limpiar mapa cuando el componente se desmonte
      return () => {
        map.remove();
      };
    }
  }, [formData.ubicacion]); // Re-renderiza cada vez que cambie la ubicación de la parada

  // Función para manejar cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, ubicacion: { ...formData.ubicacion, [name]: value } });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
      const response = await axios.put(`http://localhost:5000/api/paradas/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
        },
      });
      console.log('Parada actualizada:', response.data);
      alert('Parada actualizada correctamente');
      navigate('/admin/gestionar-paradas'); // Redirige después de actualizar
    } catch (error) {
      console.error('Error al actualizar la parada:', error.response?.data || error.message);
      alert(error.response?.data?.mensaje || 'Hubo un error al actualizar la parada.');
    }
  };

  return (
    <div className="crear-parada-container">
      <h1>Editar Parada</h1>
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

        <button type="submit">Actualizar</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};
