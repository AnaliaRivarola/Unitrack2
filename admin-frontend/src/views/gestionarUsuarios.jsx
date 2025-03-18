import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Navbar } from 'shared-frontend/components/Navbar';  // Asegúrate de que el Navbar esté importado
import { Footer } from 'shared-frontend/components/Footer';
import '../styles/GestionarUsuarios.css'; // Asegúrate de tener un archivo CSS para los estilos

export const GestionarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Obtener la lista de usuarios al cargar la vista
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/usuarios');
        
        // Acceder a la propiedad usuarios dentro del objeto de respuesta
        if (response.data.success) {
          // No incluir la contraseña en los datos que se guardan en el estado
          const usuariosSinContraseña = response.data.usuarios.map(usuario => {
            const { contraseña, ...restoUsuario } = usuario;
            return restoUsuario;
          });
          setUsuarios(usuariosSinContraseña);
        } else {
          console.error('Error al obtener usuarios');
        }
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/usuarios/${id}`);
      setUsuarios(usuarios.filter((usuario) => usuario.id_usuario !== id));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  return (
    <div className="gestionar-usuarios-container">
      <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
      <h1>Gestionar Usuarios</h1>
      
      <div className="create-user-button">
        <Link to="/admin/create-user">
          <button>Crear Usuario</button>
        </Link>
      </div>

      <table className="usuarios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id_usuario}>
              <td>{usuario.id_usuario}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>{usuario.telefono}</td>
              <td id='acciones'>
                <Link to={`/admin/usuarios/${usuario.id_usuario}/ver`}>
                  <button>Ver</button>
                </Link>
                <Link to={`/admin/usuarios/${usuario.id_usuario}/editar`}>
                  <button>Editar</button>
                </Link>
                <button onClick={() => handleDelete(usuario.id_usuario)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Footer /> {/* Coloca el Footer en la parte inferior */}
    </div>
  );
};
