// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    const token = localStorage.getItem('driver_token');
    const rol = localStorage.getItem('driver_rol');

    if (token && rol === 'chofer') {
      console.log("Usuario ya autenticado, redirigiendo al mapa del chofer...");
      navigate('/chofer/mapa'); // Redirige al mapa del chofer si ya está autenticado
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar el mensaje de error antes de intentar iniciar sesión

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email.trim(),
        contraseña,
      });

      const { token, rol } = response.data;

      console.log("Token recibido:", token);
      console.log("Rol recibido:", rol);

      // Verificar si el rol es "chofer"
      if (rol === 'chofer') {
        localStorage.setItem('driver_token', token); // Guarda el token con una clave específica para el chofer
        localStorage.setItem('driver_rol', rol); // Guarda el rol del usuario
        console.log("Token almacenado en localStorage:", localStorage.getItem('driver_token')); // Verifica que se almacene correctamente
        navigate('/chofer/mapa'); // Redirigir al mapa del chofer
      } else {
        setError('Credenciales incorrectas'); // Mostrar error si el rol no es "chofer"
      }
    } catch (error) {
      console.error("Error en el login:", error);
      setError(`Error: ${error.response?.data?.mensaje || 'Credenciales incorrectas'}`);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-header text-center bg-primary text-white">
          <h3>Iniciar sesión</h3>
          <p>Chofer</p>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contraseña" className="form-label">Contraseña</label>
              <input
                type="password"
                id="contraseña"
                className="form-control"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100">Iniciar sesión</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
