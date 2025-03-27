import React, { useState, useEffect } from 'react';
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const GestionarHorarios = () => {
  const [horarios, setHorarios] = useState([]);
  const navigate = useNavigate();

  // Obtener los horarios al montar el componente
  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/horarios');
        setHorarios(response.data);
      } catch (error) {
        console.error('Error al obtener los horarios:', error);
      }
    };

    fetchHorarios();
  }, []);

  // Eliminar un horario
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este horario?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/horarios/${id}`);
      setHorarios((prevHorarios) => prevHorarios.filter((horario) => horario._id !== id));
      alert('Horario eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el horario:', error);
      alert('Hubo un problema al eliminar el horario');
    }
  };

  // Manejar la redirección a la vista de editar
  const handleEditarHorario = (horarioId) => {
    navigate(`/admin/editar-horario/${horarioId}`);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
      <div className="page-container flex-grow-1">
        <div className="container mt-5">
        <h1>Gestionar Horarios</h1>
          <div className="d-flex justify-content-between align-items-center mb-4">
            
            <Link to="/admin/crear-horario">
              <button className="btn btn-primary">Crear Horario</button>
            </Link>
          </div>

          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Transporte</th>
                <th>Hora de Salida</th>
                <th>Hora de Regreso</th>
                <th>Origen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {horarios.map((horario) => (
                <tr key={horario._id}>
                  <td>{horario.id_transporte ? horario.id_transporte.nombre : 'N/A'}</td>
                  <td>{horario.hora_salida}</td>
                  <td>{horario.hora_regreso}</td>
                  <td>{horario.origen}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => handleEditarHorario(horario._id)}
                        className="btn btn-warning btn-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(horario._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GestionarHorarios;
