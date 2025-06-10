import React from 'react';
import { useNavigate } from 'react-router-dom';
import welcomeImage from '/public/welcome.png';
import '../styles/welcome.css'; 

export const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-card animate__animated animate__fadeInUp">
        <img 
          src={welcomeImage} 
          alt="Bienvenido" 
          className="welcome-image animate__animated animate__bounceIn"
        />
        <h1 className="mb-3 fw-bold text-primary">¡Bienvenido a UniTrack!</h1>
        <p className="text-muted mb-4">
          Seguí tus transportes universitarios en tiempo real. Filtrá por paradas, consultá horarios y asegurate de llegar siempre a tiempo.
        </p>
        <button 
          className="btn btn-primary welcome-button animate__animated animate__pulse animate__delay-1s"
          onClick={() => navigate('/filtrarParada')}
        >
          Ingresar
        </button>
      </div>
    </div>
  );
};
