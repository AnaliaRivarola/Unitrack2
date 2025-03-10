import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CreateUser.css'; // Asegúrate de tener un archivo CSS para los estilos

export const CreateUser = () => {
  const [id_usuario, setIdUsuario] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipo_usuario, setTipoUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        id_usuario,
        nombre,
        tipo_usuario,
        email,
        telefono,
        password,
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setError('');
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
    <div className="create-user-container">
      <h1>Crear Usuario</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id_usuario">ID de Usuario</label>
          <input
            type="text"
            id="id_usuario"
            placeholder="Ingrese el ID de usuario"
            value={id_usuario}
            onChange={(e) => setIdUsuario(e.target.value)}
            required
          />
        </div>

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
          <label htmlFor="tipo_usuario">Tipo de Usuario</label>
          <select
            id="tipo_usuario"
            value={tipo_usuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
            required
          >
            <option value="">Seleccionar tipo</option>
            <option value="admin">Administrador</option>
            <option value="chofer">Chofer</option>
            <option value="usuario">Usuario común</option>
          </select>
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
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            placeholder="Ingrese el teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Ingrese la contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit">Crear Usuario</button>
      </form>
    </div>
  );
};
