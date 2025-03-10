import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // Asegúrate de tener un archivo CSS para los estilos.
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      if (response.data.success) {
        // Guarda el token en localStorage o context
        localStorage.setItem("token", response.data.token);

        // Redirige según el rol del usuario
        const { role } = response.data;
        if (role === "chofer") navigate("/chofer/dashboard");
        else if (role === "admin") navigate("/admin/dashboard");
        else navigate("/dashboard"); // Por si necesitas otro rol.
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Error al iniciar sesión. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div className="login-container">
      <Navbar logoSrc="../logoLetra.png" altText="Logo" />
      <div className="login-form">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
      <Footer /> {/* Colocamos el Footer aquí */}
    </div>
  );
};
