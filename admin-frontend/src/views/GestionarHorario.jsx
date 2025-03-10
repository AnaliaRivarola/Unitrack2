import React, { useState, useEffect } from 'react';
import { Navbar } from 'shared-frontend/components/Navbar';  // Asegúrate de que el Navbar esté importado
import { Footer } from 'shared-frontend/components/Footer';
import axios from 'axios';
import '../styles/GestionarHorario.css';
import { Link } from 'react-router-dom';

const GestionarHorarios = () => {
  const [horarios, setHorarios] = useState([]);

  // Obtener los horarios al montar el componente
  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        // Realizamos la solicitud a la API
        const response = await axios.get('http://localhost:5000/api/horarios');
        
        // Verificamos los datos que estamos recibiendo
        console.log('Datos de la API:', response.data);
        
        // Guardamos los datos de los horarios en el estado
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
      // Eliminamos el horario desde la API
      await axios.delete(`http://localhost:5000/api/horarios/${id}`);
      
      // Realizamos un refetch para obtener los horarios actualizados
      const response = await axios.get('http://localhost:5000/api/horarios');
      setHorarios(response.data); // Actualizamos el estado con los nuevos horarios

      alert('Horario eliminado');
    } catch (error) {
      console.error('Error al eliminar el horario:', error);
      alert('Hubo un problema al eliminar el horario');
    }
  };

  return (
    <div id="gestion-horarios-container">
      <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" /><Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
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
              {/* Verificamos que id_transporte esté presente y mostramos el nombre */}
              <td>{horario.hora_salida}</td>
              <td>{horario.hora_regreso}</td>
              <td>{horario.origen}</td>
              <td>
                <Link to={`/editar-horario/${horario._id}`}>
                  <button id={`editar-horario-btn-${horario._id}`} className="action-btn">Editar</button>
                </Link>
                <button id={`eliminar-horario-btn-${horario._id}`} className="action-btn" onClick={() => handleDelete(horario._id)}>Eliminar</button>
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
