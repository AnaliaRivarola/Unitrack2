import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CrearParada.css'; // Asegúrate de crear este archivo para los estilos

export const CrearParada = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/paradas', formData);
      setMessage('Parada creada exitosamente.');
      setFormData({ nombre: '', ubicacion: '' }); // Limpiar el formulario
    } catch (error) {
      console.error('Error al crear la parada:', error);
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
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ubicacion">Ubicación</label>
          <input
            type="text"
            id="ubicacion"
            name="ubicacion"
            value={formData.ubicacion}
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
