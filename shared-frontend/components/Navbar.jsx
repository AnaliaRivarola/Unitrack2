import React from 'react';
import "../styles/Navbar.css";

export const Navbar = ({ logoSrc, altText }) => {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo-container">
          <img src={logoSrc} alt={altText} className="navbar-logo" />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
