import React, { useState, useEffect } from 'react';
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';
import axios from 'axios';
import '../styles/GestionarHorario.css';
import { Link, useNavigate } from 'react-router-dom';

const GestionarHorarios = () => {
  const [horarios, setHorarios] = useState([]);
  const navigate = useNavigate(); // Usamos useNavigate para redirigir

  // Obtener los horarios al montar el componente
  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/horarios');
        console.log('Datos de la API:', response.data);
        setHorarios(response.data);
      } catch (error) {
        console.error('Error al obtener los horarios:', error);
      }
    };

    fetchHorarios();
  }, []);

  // Eliminar un horario
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/horarios/${id}`);

      // Actualizamos la lista de horarios después de eliminar
      const updatedHorarios = horarios.filter((horario) => horario._id !== id);
      setHorarios(updatedHorarios); // Actualizamos el estado

      alert('Horario eliminado');
    } catch (error) {
      console.error('Error al eliminar el horario:', error);
      alert('Hubo un problema al eliminar el horario');
    }
  };

  // Manejar la redirección a la vista de editar
  const handleEditarHorario = (horarioId) => {
    navigate(`/admin/editar-horario/${horarioId}`); // Redirige a la página de edición
  };

  return (
    <div id="gestion-horarios-container">
      <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
      <h2 id="gestion-horarios-title">Gestionar Horarios</h2>
      <div id="crear-horario-btn-container">
        <Link to="/admin/crear-horario">
          <button id="crear-horario-btn">Crear Horario</button>
        </Link>
      </div>
      <table id="tabla-horarios">
        <thead>
          <tr>
            <th>Transporte</th>
            <th>Hora de Salida</th>
            <th>Hora de Regreso</th>
            <th>Origen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapeamos los horarios para mostrarlos */}
          {horarios.map((horario) => (
            <tr key={horario._id}>
              <td>{horario.id_transporte ? horario.id_transporte.nombre : 'N/A'}</td>
              <td>{horario.hora_salida}</td>
              <td>{horario.hora_regreso}</td>
              <td>{horario.origen}</td>
              <td>
                <button
                  onClick={() => handleEditarHorario(horario._id)} // Pasamos el id del horario
                  className="accion-btn editar-btn"
                >
                  Editar Horario
                </button>
                <button
                  id={`eliminar-horario-btn-${horario._id}`}
                  className="action-btn"
                  onClick={() => handleDelete(horario._id)} // Pasamos el id del horario
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Footer />
    </div>
  );
};

export default GestionarHorarios;
