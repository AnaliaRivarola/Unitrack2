import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import '../styles/CreateUser.css';
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';

export const CreateUser = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [rol, setRol] = useState('');
  const [estado, setEstado] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Declara useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token'); // Obtén el token del almacenamiento local
      const response = await axios.post(
        'http://localhost:5000/api/auth/usuarios',
        {
          nombre,
          email,
          contraseña,
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
        navigate('/admin/gestionar-usuarios'); // Redirige al dashboard del administrador
      } else {
        setError(response.data.message);
        setSuccess('');
      }
    } catch (err) {
      setError('Error al crear el usuario.');
      setSuccess('');
    }
  };

  return (
    <>
     <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
    <div className="create-user-container">
      <h1>Crear Usuario</h1>
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
            placeholder="Ingrese la contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
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

        <button type="submit">Crear Usuario</button>
      </form>
    </div>
    <Footer />
    </>
  );
};
