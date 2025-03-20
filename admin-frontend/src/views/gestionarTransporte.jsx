import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const TransporteList = () => {
  const [transportes, setTransportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/transportes')
      .then(response => {
        console.log("Datos obtenidos:", response.data);
        if (Array.isArray(response.data)) {
          setTransportes(response.data);
        } else {
          console.error('La API no devolvió un array. Estructura recibida:', response.data);
        }
      })
      .catch(error => console.error("Error al obtener transportes:", error))
      .finally(() => setLoading(false)); // Asegura que loading se actualiza
  }, []);

  // Función para eliminar un transporte
  const deleteTransporte = async (id) => {
    try {
      await axios.delete(`/api/transportes/${id}`);
      setTransportes(transportes.filter((transporte) => transporte._id !== id));
    } catch (error) {
      console.error('Error al eliminar el transporte', error);
    }
  };

  return (
    <div>
      <h1>Lista de Transportes</h1>
      <div>
        <Link to="/admin/crear-transporte">
          <button className="btn btn-primary">Crear Transporte</button>
        </Link>
      </div>
      {loading ? (
        <p>Cargando transportes...</p>
      ) : transportes.length === 0 ? (
        <p>No hay transportes disponibles.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Coban ID</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transportes.map((transporte) => (
              <tr key={transporte._id}>
                <td>{transporte.nombre}</td>
                <td>{transporte.coban_id}</td>
                <td>
                  {' '}
                  <Link to={`/transporte/editar/${transporte._id}`}>
                    <button className="btn btn-warning">Editar</button>
                  </Link>
                  {' '}
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteTransporte(transporte._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
