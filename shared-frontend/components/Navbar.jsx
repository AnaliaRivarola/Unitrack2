import React from 'react';
import "../styles/Navbar.css";

export const Navbar = ({ logoSrc, altText }) => {
  const navigate = useNavigate(); // Inicializa useNavigate para manejar la navegación

  const handleBack = () => {
    navigate(-1); // Navega a la página anterior
  };

  return (
    <div>
      <nav className="navbar">
        {/* Flecha para regresar */}
        <div className="navbar-logo-container">
          <img src={logoSrc} alt={altText} className="navbar-logo" />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
