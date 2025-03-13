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
      const response = await axios.get('http://localhost:5000/api/paradas');
      setParadas(response.data);
    } catch (error) {
      console.error('Error al obtener las paradas:', error);
    }
  };

  // Función para eliminar una parada
  const handleEliminar = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta parada?');
    if (confirmacion) {
      try {
        await axios.delete(`http://localhost:5000/api/paradas/${id}`);
        alert('Parada eliminada correctamente');
        fetchParadas(); // Actualiza la lista después de eliminar
      } catch (error) {
        console.error('Error al eliminar la parada:', error);
        alert('Hubo un error al intentar eliminar la parada.');
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
