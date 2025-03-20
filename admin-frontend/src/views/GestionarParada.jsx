import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from 'shared-frontend/components/Navbar';  // Asegúrate de que el Navbar esté importado
import { Footer } from 'shared-frontend/components/Footer';

import '../styles/GestionarParada.css';

export const GestionarParadas = () => {
  const [paradas, setParadas] = useState([]);
  const navigate = useNavigate();

  // Función para obtener la lista de paradas desde el backend
  const fetchParadas = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
      const response = await axios.get('http://localhost:5000/api/paradas', {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
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
        const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
        const response = await axios.delete(`http://localhost:5000/api/paradas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        });
        alert('Parada eliminada correctamente');
        // Actualiza la lista de paradas después de eliminar
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

  return (
    <div className="gestionar-paradas-container">
      <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
      <div className="header">
        <h1>Gestionar Paradas</h1>
        <button onClick={() => navigate('/admin/crear-parada')} className="crear-parada-btn">
          Crear Parada
        </button>
      </div>

      <div className="paradas-list">
        {paradas.length > 0 ? (
          <ul>
            {paradas.map((parada) => (
              <li key={parada._id} className="parada-item">
                <div className="parada-info">
                  <h3>{parada.nombre}</h3>
                  {/* Accede a las propiedades latitud y longitud */}
                  <p>Latitud: {parada.ubicacion.latitud}, Longitud: {parada.ubicacion.longitud}</p>
                </div>
                <div className="acciones">
                  <button onClick={() => navigate(`/admin/editar-parada/${parada._id}`)} className="accion-btn editar-btn">
                    Editar
                  </button>
                  <button onClick={() => handleEliminar(parada._id)} className="accion-btn eliminar-btn">
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay paradas disponibles.</p>
        )}
      </div>
      <Footer /> {/* Coloca el Footer en la parte inferior */}
    </div>
  );
};
