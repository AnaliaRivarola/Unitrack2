import { useState, useEffect } from 'react';  
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AdminDashboard } from './views/AdminDashboard'; // Importa el Dashboard
import { CreateUser } from './views/CreateUser';
import { CrearParada } from './views/CrearParada';
import { EditParada } from './views/EditParada';
import { GestionarParadas } from './views/GestionarParada';
import { GestionarUsuarios } from './views/gestionarUsuarios';
import { CrearHorario } from './views/CrearHorario';
import GestionarHorarios from './views/GestionarHorario';
import { TransporteList } from './views/gestionarTransporte';
import { CrearTransporte } from "./views/CrearTransporte";
import { EditarHorario } from './views/EditHorario'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './views/Login'; // Asegúrate de tener la ruta correcta


import './App.css';
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0);

  // Verificar si hay un token en el localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  return (
    <Router>
      <Routes>
        {/* Si no está autenticado, redirigir a /login */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/admin/dashboard" /> : <Navigate to="/login" />} />
        
        {/* Ruta de login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas para el administrador */}
        <Route path="/admin/dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/create-user" element={isAuthenticated ? <CreateUser /> : <Navigate to="/login" />} />
        <Route path="/admin/gestionar-usuarios" element={isAuthenticated ? <GestionarUsuarios /> : <Navigate to="/login" />} />
        <Route path="/admin/gestionar-paradas" element={isAuthenticated ? <GestionarParadas /> : <Navigate to="/login" />} />
        <Route path="/admin/crear-parada" element={isAuthenticated ? <CrearParada /> : <Navigate to="/login" />} />
        <Route path="/admin/editar-parada/:id" element={isAuthenticated ? <EditParada /> : <Navigate to="/login" />} />
        <Route path="/admin/crear-horario" element={isAuthenticated ? <CrearHorario /> : <Navigate to="/login" />} />
        <Route path="/admin/gestionar-horarios" element={isAuthenticated ? <GestionarHorarios /> : <Navigate to="/login" />} />
        <Route path="/admin/gestionar-transporte" element={isAuthenticated ? <TransporteList /> : <Navigate to="/login" />} />
        <Route path="/admin/crear-transporte" element={isAuthenticated ? <CrearTransporte /> : <Navigate to="/login" />} />
        <Route path="/admin/editar-horario/:id" element={isAuthenticated ? <EditarHorario /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
