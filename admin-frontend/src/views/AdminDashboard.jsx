import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from 'shared-frontend/components/Navbar';  // Asegúrate de que el Navbar esté importado
import { Footer } from 'shared-frontend/components/Footer';  // Asegúrate de que el Footer esté importado
import "../styles/AdminDashboard.css"; // Estilos para el Dashboard (deberás crear este archivo CSS)

export const AdminDashboard = () => {
  const navigate = useNavigate();

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
      </div>

      <Footer /> {/* Coloca el Footer en la parte inferior */}
    </div>
  );
};
