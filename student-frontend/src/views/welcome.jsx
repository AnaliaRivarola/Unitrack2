import React from 'react';
import { useNavigate } from 'react-router-dom';
import welcomeImage from '../assets/welcome.png'; // Importa la imagen

export const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <img 
        src={welcomeImage} 
        alt="Bienvenido" 
        className="img-fluid mb-4" 
        style={{ maxWidth: '300px' }} 
      />
      <h1 className="mb-3">¡Bienvenido a UniTrack!</h1>
      <p className="lead mb-4">
        UniTrack es una aplicación de seguimiento en tiempo real diseñada para ayudarte a llegar a tiempo a tu lugar de estudio. ¡Esperamos que te sea de gran utilidad!
      </p>
      <button 
        className="btn btn-primary btn-lg" 
        onClick={() => navigate('/filtrarParada')}
      >
        Ingresar
      </button>
    </div>
  );
};