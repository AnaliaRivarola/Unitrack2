// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const Login = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email.trim(),
        contraseña,
      });
  
      const { token, rol } = response.data;
      
      console.log("Token recibido:", token);
      console.log("Rol recibido:", rol);
  
      localStorage.setItem('token', token);
      localStorage.setItem('rol', rol);
  
      // Definir las URLs de cada aplicación
      const adminURL = 'http://localhost:5173';
      const driverURL = 'http://localhost:5174';

      // Redirigir a la app correspondiente
      if (rol === 'admin') {
        window.location.href = `${adminURL}/admin/dashboard`;
      } else if (rol === 'chofer') {
        window.location.href = `${driverURL}/driver/dashboard`;
      } else {
        setError('Rol no válido');
      }
  
    } catch (error) {
      console.error("Error en el login:", error);
      setError(`Error: ${error.response?.data?.mensaje || error.message}`);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-header text-center bg-primary text-white">
          <h3>Iniciar sesión</h3>
          <p>Administrador</p>
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
