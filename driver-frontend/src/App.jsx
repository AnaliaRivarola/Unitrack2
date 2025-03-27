import { useState, useEffect } from 'react';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MapView } from "./views/mapChofer";
import { MensajesRapidos } from "./views/mensajes";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Login from './views/Login';  // Asegúrate de tener la ruta correcta

function App() {
  const [count, setCount] = useState(0);

  // Verificar si hay un token en el localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('driver_token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('driver_token'));
    };
  
    window.addEventListener('storage', handleStorageChange);
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/Unitrack')  // Cambia esto si tu ruta de API es diferente
      .then(response => {
        console.log('Datos obtenidos:', response.data);
      })
      .catch(error => {
        console.error('Error al conectar con el servidor:', error);
      });
  }, []); // Asegúrate de que useEffect esté dentro de la función del componente

  return (
    <Router>
      <Routes>

        {/* Si no está autenticado, redirigir a /login */}
        <Route path="/" element={isAuthenticated ? <MapView /> : <Login />} />
        
        {/* Ruta de login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas para el chofer */}
        <Route path="/chofer/mapa" element={isAuthenticated ? <MapView /> : <Login />} />
        <Route path="/chofer/mensajes" element={isAuthenticated ? <MensajesRapidos /> : <Login />} />

      </Routes>
    </Router>
  );
}

export default App;
