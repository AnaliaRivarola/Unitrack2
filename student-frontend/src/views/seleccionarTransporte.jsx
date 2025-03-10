import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';  // Importar useParams
//import { Navbar } from 'shared-frontend/components/Navbar';
//import { Footer } from 'shared-frontend/components/Footer';
import "../styles/seleccionarTransporte.css";

function SeleccionarTransportes() {
  const { paradaId } = useParams(); // Obtener el ID de la parada de la URL
  const [transportes, setTransportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (paradaId) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/transports/${paradaId}`)
        .then(response => {
          setTransportes(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error al obtener transportes:', error);
          setLoading(false);
        });
    }
  }, [paradaId]);

  return (
    <div className="page-container">


      <div className="transport-list">
        <h3>Transportes disponibles para esta parada:</h3>
        {loading ? (
          <p>Cargando transportes...</p>
        ) : (
          <ul>
            {transportes.length > 0 ? (
              transportes.map(transporte => (
                <li key={transporte._id}>
                  {transporte.nombre} ({transporte.latitud}, {transporte.longitud})
                </li>
              ))
            ) : (
              <li>No hay transportes disponibles para esta parada</li>
            )}
          </ul>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default SeleccionarTransportes;
