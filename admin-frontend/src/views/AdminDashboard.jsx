import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from 'shared-frontend/components/Navbar';  // Asegúrate de que el Navbar esté importado
import { Footer } from 'shared-frontend/components/Footer';  // Asegúrate de que el Footer esté importado
import "../styles/AdminDashboard.css"; // Estilos para el Dashboard (deberás crear este archivo CSS)

export const AdminDashboard = () => {
  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token
    localStorage.removeItem('rol');   // Elimina el rol
    navigate('/login');               // Redirige al login
  };

  // Función para la navegación
  const handleNavigation = (route) => {
    navigate(route); // Redirige a la vista correspondiente
  };

  return (
    <div className="admin-dashboard-container">
      <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />

      <div className="dashboard-content">
        <h1>Panel de Control - Administrador</h1>
        
        <div className="dashboard-options">
          <button onClick={() => handleNavigation("/admin/gestionar-transporte")}>
            Gestionar Transporte
          </button>
          <button onClick={() => handleNavigation("/admin/gestionar-paradas")}>
            Gestionar Paradas
          </button>
          <button onClick={() => handleNavigation("/admin/gestionar-usuarios")}>
            Gestionar Usuarios
          </button>
          <button onClick={() => handleNavigation("/admin/gestionar-horarios")}>
            Gestionar Horarios
          </button>
        </div>

        {/* Botón de Cerrar Sesión */}
        <button className="btn btn-danger mt-3" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <Footer /> {/* Coloca el Footer en la parte inferior */}
    </div>
  );
};
