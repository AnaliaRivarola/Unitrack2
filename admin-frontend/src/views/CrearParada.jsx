import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CrearParada.css'; // Mantén los estilos originales

export const CrearParada = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: { latitud: '', longitud: '' }, // Campos de latitud y longitud vacíos inicialmente
  });
  const [message, setMessage] = useState('');

  // Función para manejar cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, ubicacion: { ...formData.ubicacion, [name]: value } });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/paradas', formData);
      setMessage('Parada creada exitosamente.');
      setFormData({ nombre: '', ubicacion: { latitud: '', longitud: '' } }); // Restablece el formulario
    } catch (error) {
      console.error('Error al crear la parada:', error.response ? error.response.data : error.message);
      setMessage('Hubo un error al crear la parada.');
    }
  };

  return (
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
  );
};
