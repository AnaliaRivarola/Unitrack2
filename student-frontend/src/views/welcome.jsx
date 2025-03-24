import React from 'react';
import { useNavigate } from 'react-router-dom';
import welcomeImage from '../assets/welcome.png'; // Importa la imagen

export const Welcome = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <button 
        className="btn btn-primary btn-lg" 
        onClick={() => alert('Navegación deshabilitada temporalmente')}
      >
        Ingresar
      </button>
    </div>
  );
};