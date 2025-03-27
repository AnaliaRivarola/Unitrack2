import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Para obtener el ID del usuario y redirigir
import '../styles/CreateUser.css'; // Reutilizamos los estilos de creación de usuario
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';

export const EditUser = () => {
  const { id } = useParams(); // Obtiene el ID del usuario desde la URL
  const navigate = useNavigate(); // Para redirigir después de editar
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [rol, setRol] = useState('');
  const [estado, setEstado] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar los datos del usuario al montar el componente
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('admin_token'); // Obtén el token del almacenamiento local
        const response = await axios.get(`http://localhost:5000/api/auth/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        });

        const { usuario } = response.data;
        setNombre(usuario.nombre);
        setEmail(usuario.email);
        setRol(usuario.rol);
        setEstado(usuario.estado);
      } catch (err) {
        setError('Error al cargar los datos del usuario.');
      }
    };

    fetchUser();
  }, [id]);

  // Manejar la edición del usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token'); // Obtén el token del almacenamiento local
      const response = await axios.put(
        `http://localhost:5000/api/auth/usuarios/${id}`,
        {
          nombre,
          email,
          contraseña: contraseña || undefined, // Solo enviar contraseña si se ha cambiado
          rol,
          estado,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message);
        setError('');
        navigate('/admin/gestionar-usuarios'); // Redirige al listado de usuarios
      } else {
        setError(response.data.message);
        setSuccess('');
      }
    } catch (err) {
      setError('Error al editar el usuario.');
      setSuccess('');
    }
  };

  return (
    <>
    <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
    <div className="create-user-container">
      <h1>Editar Usuario</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            placeholder="Ingrese el nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            placeholder="Ingrese el correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contraseña">Contraseña</label>
          <input
            type="password"
            id="contraseña"
            placeholder="Ingrese una nueva contraseña (opcional)"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="rol">Rol</label>
          <select
            id="rol"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
          >
            <option value="">Seleccionar rol</option>
            <option value="superadmin">Superadmin</option>
            <option value="admin">Administrador</option>
            <option value="chofer">Chofer</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado</label>
          <input
            type="checkbox"
            id="estado"
            checked={estado}
            onChange={(e) => setEstado(e.target.checked)}
          />
          <span>{estado ? 'Activo' : 'Inactivo'}</span>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
    <Footer />
    </>
  );
};
