import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
//import { Navbar } from 'shared-frontend/components/Navbar';
//import { Footer } from 'shared-frontend/components/Footer';
import "../styles/filtrarParada.css";

function FiltrarParada() {
  const [paradas, setParadas] = useState([]); // Lista completa de paradas
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [filteredParadas, setFilteredParadas] = useState([]); // Paradas filtradas
  const navigate = useNavigate(); // Inicializar el hook de navegación

  // Obtener paradas al cargar la página
  useEffect(() => {
    axios.get('http://localhost:5000/api/paradas')
      .then(response => {
        setParadas(response.data);
        setFilteredParadas(response.data); // Inicialmente, todas las paradas están filtradas
      })
      .catch(error => console.error('Error al obtener paradas:', error));
  }, []);

  // Filtrar las paradas según el término de búsqueda
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredParadas(paradas); // Si no hay término de búsqueda, mostrar todas las paradas
    } else {
      setFilteredParadas(
        paradas.filter(parada => 
          parada.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
          parada.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, paradas]);

  // Función para manejar la selección de una parada
  const handleParadaSelect = (paradaId) => {
    // Redirigir a la vista de SeleccionarTransporte y pasar el ID de la parada seleccionada
    navigate(`/seleccionarTransporte/${paradaId}`);
  };

  return (
    <div className="page-container">
     

      <div className="search-container">
        <input 
          type="text" 
          placeholder="Buscar parada por nombre o ubicación..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="search-results">
        {/* Mostrar la lista completa o los resultados filtrados */}
        <ul>
          {filteredParadas.length > 0 ? (
            filteredParadas.map(parada => (
              <li 
                key={parada._id} 
                onClick={() => handleParadaSelect(parada._id)} // Redirigir a la nueva vista
                className="search-item"
              >
                <div className="parada-nombre">{parada.nombre}</div>
                <div className="parada-ubicacion">{parada.ubicacion}</div>
              </li>
            ))
          ) : (
            <li>No se encontraron paradas</li>
          )}
        </ul>
      </div>

  
    </div>
  );
}

export default FiltrarParada;
