import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AdminDashboard } from './views/AdminDashboard';
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
import Login from './views/Login';
import { EditUser } from './views/EditUser';
import { EditarTransporte } from "./views/EditarTransporte";
import './App.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('admin_token'));
  const [errorMessage, setErrorMessage] = useState(null); // Estado para el mensaje de error

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('admin_token'));
    };
  
    window.addEventListener('storage', handleStorageChange);
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Configura el interceptor de Axios
    const axiosInterceptor = axios.interceptors.response.use(
      (response) => response, // Si la respuesta es exitosa, simplemente devuélvela
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Si el token ha expirado, muestra un mensaje y redirige al login
          toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          localStorage.removeItem('token'); // Elimina el token del almacenamiento local
          setIsAuthenticated(false); // Actualiza el estado de autenticación
          window.location.href = '/login'; // Redirige al login
        }
        return Promise.reject(error); // Rechaza el error para manejarlo en otros lugares si es necesario
      }
    );

    return () => {
      // Elimina el interceptor cuando el componente se desmonte
      axios.interceptors.response.eject(axiosInterceptor);
    };
  }, []);

  return (
    <Router>
      <div>
        {/* Muestra el mensaje de error si existe */}
        {errorMessage && (
          <div className="alert alert-danger text-center" role="alert">
            {errorMessage}
          </div>
        )}
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
          <Route path="/admin/usuarios/:id/editar" element={<EditUser />} />
          <Route path="/admin/editar-transporte/:id" element={<EditarTransporte />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
