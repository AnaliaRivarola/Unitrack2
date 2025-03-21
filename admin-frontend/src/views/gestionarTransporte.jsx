import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const TransporteList = () => {
  const [transportes, setTransportes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener la lista de transportes desde el backend
  const fetchTransportes = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
      const response = await axios.get('http://localhost:5000/api/transportes', {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
        },
      });
      console.log("Datos obtenidos:", response.data); // Verifica los datos obtenidos
      if (Array.isArray(response.data)) {
        setTransportes(response.data);
      } else {
        console.error('La API no devolvió un array. Estructura recibida:', response.data);
      }
    } catch (error) {
      console.error("Error al obtener transportes:", error.response?.data || error.message);
    } finally {
      setLoading(false); // Asegura que loading se actualiza
    }
  };

  // Función para eliminar un transporte
  const deleteTransporte = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este transporte?');
    if (confirmacion) {
      try {
        const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
        await axios.delete(`http://localhost:5000/api/transportes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        });
        alert('Transporte eliminado correctamente');
        // Actualiza la lista de transportes después de eliminar
        setTransportes((prevTransportes) => prevTransportes.filter((transporte) => transporte._id !== id));
      } catch (error) {
        console.error('Error al eliminar el transporte:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'Hubo un error al eliminar el transporte.');
      }
    }
  };

  // Cargar los transportes al montar el componente
  useEffect(() => {
    fetchTransportes();
  }, []);

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
              <th>GPS Relacionado</th>
              <th>Paradas Relacionadas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transportes.map((transporte) => (
              <tr key={transporte._id}>
                <td>{transporte.nombre}</td>
                <td>{transporte.gpsId ? transporte.gpsId : 'Sin GPS'}</td>
                <td>
                  {/* Renderizar las paradas relacionadas */}
                  {transporte.paradas && transporte.paradas.length > 0 ? (
                    <ul>
                      {transporte.paradas.map((p, index) => (
                        <li key={p.parada?._id || index}>{p.parada?.nombre || ""}</li>
                      ))}
                    </ul>
                  ) : (
                    'Sin paradas'
                  )}
                </td>
                <td>
                  <Link to={`/admin/editar-transporte/${transporte._id}`}>
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
