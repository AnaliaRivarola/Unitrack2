import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';
import "../styles/AdminDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_rol');
    localStorage.removeItem('rol');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <>
      <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Panel de Control - Administrador</h1>
        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Gestionar Transporte</h5>
                <p className="card-text">Administra los vehículos y rutas disponibles.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleNavigation("/admin/gestionar-transporte")}
                >
                  Ir a Transporte
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Gestionar Paradas</h5>
                <p className="card-text">Configura y administra las paradas de transporte.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleNavigation("/admin/gestionar-paradas")}
                >
                  Ir a Paradas
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Gestionar Usuarios</h5>
                <p className="card-text">Administra los usuarios registrados en el sistema.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleNavigation("/admin/gestionar-usuarios")}
                >
                  Ir a Usuarios
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Gestionar Horarios</h5>
                <p className="card-text">Configura los horarios de transporte disponibles.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleNavigation("/admin/gestionar-horarios")}
                >
                  Ir a Horarios
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de Cerrar Sesión */}
        <div className="text-center mt-5">
  <h5>¿Quieres cerrar sesión?</h5>
  <button
    className="btn btn-danger"
    style={{ width: "150px" }} // Ajusta el ancho del botón
    onClick={handleLogout}
  >
    Cerrar sesión
  </button>
</div>
      </div>
      <Footer />
    </>
  );
};
