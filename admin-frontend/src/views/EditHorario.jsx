import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Para obtener el id de la URL y redirigir después
import '../styles/CrearHorario.css';
import axios from 'axios';

export const EditarHorario = () => {
  const [transportes, setTransportes] = useState([]); // Lista de transportes
  const [formData, setFormData] = useState({
    id_transporte: '',
    hora_salida: '',
    hora_regreso: '',
    origen: '',
  });
  const { id } = useParams(); // Obtener el id del horario de la URL
  const navigate = useNavigate(); // Para redirigir a otra página después de guardar

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
  
    const fetchHorario = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/horarios/${id}`);
        // Asegurarse de que el transporte es el correcto
        const horario = response.data;
        setFormData({
          id_transporte: horario.id_transporte._id,  // Asegúrate de que estamos obteniendo el id del transporte correctamente
          hora_salida: horario.hora_salida,
          hora_regreso: horario.hora_regreso,
          origen: horario.origen,
        });
      } catch (error) {
        console.error('Error al obtener el horario:', error);
      }
    };
  
    fetchTransportes();
    fetchHorario(); // Llamar a la función para obtener el horario
  }, [id]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Enviar formulario para editar horario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/horarios/${id}`, formData); // Usar PUT para editar
      alert('Horario editado exitosamente');
      navigate('/admin/gestionar-horarios'); // Redirigir a la lista de horarios
    } catch (error) {
      console.error('Error al editar horario:', error);
      alert('Hubo un problema al editar el horario');
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

        <button type="submit" id="crear-horario-btn">Editar Horario</button>
      </form>
    </div>
  );
};
