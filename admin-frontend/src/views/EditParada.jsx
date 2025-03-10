import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CrearParada.css'; // Asegúrate de que los estilos sean los mismos

export const EditParada = () => {
  const { id } = useParams(); // Obtener el id de la parada desde la URL
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Obtener los datos de la parada al montar el componente
  useEffect(() => {
    const fetchParada = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/paradas/${id}`);
        setFormData(response.data); // Establecer los datos de la parada en el estado
      } catch (error) {
        console.error('Error al obtener la parada:', error);
        setMessage('Hubo un error al obtener la parada.');
      }
    };

    fetchParada();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/paradas/${id}`, formData);
      setMessage('Parada actualizada exitosamente.');
      setTimeout(() => {
        navigate('/admin/gestionar-paradas'); // Redirigir a la lista de paradas después de la actualización
      }, 1500);
    } catch (error) {
      console.error('Error al actualizar la parada:', error);
      setMessage('Hubo un error al actualizar la parada.');
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

        <button type="submit">Actualizar</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};
