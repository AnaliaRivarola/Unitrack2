import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';

import '../styles/GestionarParada.css';

export const GestionarParadas = () => {
  const [paradas, setParadas] = useState([]);
  const [transportes, setTransportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Función para obtener la lista de paradas desde el backend
  const fetchParadas = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get('http://localhost:5000/api/paradas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setParadas(response.data);
    } catch (error) {
      console.error('Error al obtener las paradas:', error.response?.data || error.message);
    }
  };

  // Función para eliminar una parada
  const handleEliminar = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta parada?');
    if (confirmacion) {
      try {
        const token = localStorage.getItem('admin_token');
        await axios.delete(`http://localhost:5000/api/paradas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Parada eliminada correctamente');
        setParadas((prevParadas) => prevParadas.filter((parada) => parada._id !== id));
      } catch (error) {
        console.error('Error al eliminar la parada:', error.response?.data || error.message);
        alert(error.response?.data?.mensaje || 'Hubo un error al eliminar la parada.');
      }
    }
  };

  // Cargar las paradas al montar el componente
  useEffect(() => {
    fetchParadas();
  }, []);

  useEffect(() => {
    const fetchTransportes = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await axios.get('http://localhost:5000/api/transportes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransportes(response.data);
      } catch (error) {
        console.error('Error al obtener transportes:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransportes();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
      <div className="page-container flex-grow-1">

        <div className="container mt-5">
        <h1>Gestionar Paradas</h1>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button onClick={() => navigate('/admin/crear-parada')} className="btn btn-primary">
              Crear Parada
            </button>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3">Cargando paradas...</p>
            </div>
          ) : paradas.length > 0 ? (
            <ul className="list-group">
              {paradas.map((parada) => (
                <li key={parada._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h5>{parada.nombre}</h5>
                    <p className="mb-0">Latitud: {parada.ubicacion.latitud}, Longitud: {parada.ubicacion.longitud}</p>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/editar-parada/${parada._id}`)}
                      className="btn btn-warning btn-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(parada._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="alert alert-warning text-center" role="alert">
              No hay paradas disponibles.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
