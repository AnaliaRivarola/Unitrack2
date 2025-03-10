import React, { useState, useEffect } from 'react';
import '../styles/CrearHorario.css';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

export const EditarHorario = () => {
  const { id } = useParams(); // Obtenemos el ID del horario desde la URL
  const history = useHistory(); // Para redirigir después de guardar

  const [transportes, setTransportes] = useState([]); // Lista de transportes
  const [formData, setFormData] = useState({
    id_transporte: '',
    hora_salida: '',
    hora_regreso: '',
    origen: '',
  });

  // Obtener transportes al montar el componente
  useEffect(() => {
    const fetchTransportes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/transportes');
        setTransportes(response.data);
      } catch (error) {
        console.error('Error al obtener transportes:', error);
      }
    };

    fetchTransportes();
  }, []);

  // Obtener los detalles del horario a editar
  useEffect(() => {
    const fetchHorario = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/horarios/${id}`);
        setFormData(response.data); // Cargar los datos del horario en el formulario
      } catch (error) {
        console.error('Error al obtener el horario:', error);
      }
    };

    if (id) {
      fetchHorario();
    }
  }, [id]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Enviar formulario para actualizar el horario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/horarios/${id}`, formData); // Usamos PUT para actualizar
      alert('Horario actualizado exitosamente');
      history.push('/horarios'); // Redirigir a la lista de horarios después de guardar
    } catch (error) {
      console.error('Error al actualizar el horario:', error);
      alert('Hubo un problema al actualizar el horario');
    }
  };

  return (
    <div id="crear-horario-container">
      <h2 id="crear-horario-title">Editar Horario</h2>
      <form id="crear-horario-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id_transporte">Transporte:</label>
          <select
            id="id_transporte"
            name="id_transporte"
            value={formData.id_transporte}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="">Seleccione un transporte</option>
            {transportes.map((transporte) => (
              <option key={transporte._id} value={transporte._id}>
                {transporte.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="hora_salida">Hora de salida:</label>
          <input
            type="time"
            id="hora_salida"
            name="hora_salida"
            value={formData.hora_salida}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="hora_regreso">Hora de regreso:</label>
          <input
            type="time"
            id="hora_regreso"
            name="hora_regreso"
            value={formData.hora_regreso}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="origen">Origen:</label>
          <input
            type="text"
            id="origen"
            name="origen"
            value={formData.origen}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <button type="submit" id="crear-horario-btn">Actualizar Horario</button>
      </form>
    </div>
  );
};

export default EditarHorario;
