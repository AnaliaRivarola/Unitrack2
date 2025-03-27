import React from 'react';
import "../styles/Navbar.css";

export const Navbar = ({ logoSrc, altText, children }) => {
  return (
    <nav className="navbar px-3">
      <div className="container-fluid d-flex justify-content-center align-items-center">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img
            src={logoSrc}
            alt={altText}
            width="180" // Ajusta el tamaño del logo
            height="50"
            className="me-2"
          />
        </a>
        <div className="position-absolute end-0 me-3">{children}</div> {/* Renderiza los hijos a la derecha */}
      </div>
    </nav>
  );
};

