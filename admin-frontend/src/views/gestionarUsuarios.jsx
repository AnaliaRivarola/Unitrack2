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

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
        const response = await axios.get('http://localhost:5000/api/auth/usuarios', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUsuarios(response.data.usuarios);
        }
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        setError('No se pudieron cargar los usuarios. Intenta nuevamente.');
      }
    };

    const fetchUsuarioAutenticado = async () => {
      try {
        const token = localStorage.getItem('token');
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

    fetchUsuarios();
    fetchUsuarioAutenticado();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (!confirmDelete) return; // Si el usuario cancela, no se ejecuta la eliminación

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/auth/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsuarios(usuarios.filter((usuario) => usuario._id !== id)); // Actualiza la lista de usuarios
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  return (
    <>
      <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
      <div className="gestionar-usuarios-container">
        <h1>Gestionar Usuarios</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="create-user-button">
          <Link to="/admin/create-user">
            <button>Crear Usuario</button>
          </Link>
        </div>

        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios
              .filter((usuario) => usuario._id !== usuarioAutenticado?._id) // Filtrar al usuario autenticado (admin)
              .map((usuario) => (
                <tr key={usuario._id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td id="acciones">
                    <Link to={`/admin/usuarios/${usuario._id}/editar`}>
                      <button>Editar</button>
                    </Link>
                    <button onClick={() => handleDelete(usuario._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Footer />
      </div>
    </>
  );
};