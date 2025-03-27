import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';
import '../styles/GestionarUsuarios.css';

export const GestionarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);
  const [error, setError] = useState('');

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get('http://localhost:5000/api/auth/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data.usuarios)) {
        setUsuarios(response.data.usuarios);
      } else {
        console.error('La propiedad "usuarios" de la API no es un array:', response.data.usuarios);
        setUsuarios([]);
      }
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('admin_token');
        window.location.href = '/login';
      } else {
        setError('Error al obtener usuarios. Intenta nuevamente más tarde.');
        console.error('Error al obtener usuarios:', error);
      }
    }
  };

  useEffect(() => {
    fetchUsuarios();
    const fetchUsuarioAutenticado = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsuarioAutenticado(response.data.usuario);
      } catch (error) {
        console.error('Error al obtener el usuario autenticado:', error);
      }
    };

    fetchUsuarioAutenticado();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`http://localhost:5000/api/auth/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsuarios(usuarios.filter((usuario) => usuario._id !== id));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
      <div className="page-container flex-grow-1">
        <div className="container mt-5">
        <h1>Gestionar Usuarios</h1>
          <div className="d-flex justify-content-between align-items-center mb-4">
            
            <Link to="/admin/create-user">
              <button className="btn btn-primary">Crear Usuario</button>
            </Link>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(usuarios) &&
                usuarios
                  .filter((usuario) => usuario._id !== usuarioAutenticado?._id)
                  .map((usuario) => (
                    <tr key={usuario._id}>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.email}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link to={`/admin/usuarios/${usuario._id}/editar`}>
                            <button className="btn btn-warning btn-sm">Editar</button>
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(usuario._id)}
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