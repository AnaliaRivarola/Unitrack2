import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';

export const TransporteList = () => {
  const [transportes, setTransportes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransportes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/transportes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (Array.isArray(response.data)) {
        setTransportes(response.data);
      }
    } catch (error) {
      console.error("Error al obtener transportes:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransportes();
  }, []);

  return (
    <>
      <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Lista de Transportes</h1>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5">Gestión de Transportes</h2>
          <Link to="/admin/crear-transporte">
            <button className="btn btn-primary">Crear Transporte</button>
          </Link>
        </div>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando transportes...</p>
          </div>
        ) : transportes.length === 0 ? (
          <div className="alert alert-warning text-center" role="alert">
            No hay transportes disponibles.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>GPS Relacionado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {transportes.map((transporte) => (
                  <tr key={transporte._id}>
                    <td>{transporte.nombre}</td>
                    <td>{transporte.gpsId ? transporte.gpsId : 'Sin GPS'}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/admin/editar-transporte/${transporte._id}`}>
                          <button className="btn btn-warning btn-sm">Editar</button>
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteTransporte(transporte._id)}
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
        )}
      </div>
      <Footer />
    </>
  );
};
