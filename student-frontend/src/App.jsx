// App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import FiltrarParada from './views/filtrarParada'; // Importar FiltrarParada
import { MapView } from './views/map';
import SeleccionarTransporte from './views/seleccionarTransporte'; // Importar SeleccionarTransporte
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import HorariosDisponibles from "../src/views/verHorarios"; // Ajusta la ruta si es necesario
import "bootstrap/dist/css/bootstrap.min.css"; // Importar estilos de Bootstrap
import ParadasConTransporte from './views/paradasConTransporte';
import { Welcome } from './views/welcome'; // Importar la vista de bienvenida
import { FAQ } from './views/faq'; // Importar la vista de preguntas frecuentes
import { Normas } from './views/normas'; // Importar la vista de normas de uso
import { Politicas } from './views/politicas'; // Importar la vista de políticas de privacidad
import { Contacto } from './views/contacto'; // Importar la vista de contacto
function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/Unitruck`)
      .then(response => {
        console.log('Datos obtenidos:', response.data);
      })
      .catch(error => {
        console.error('Error al conectar con el servidor:', error);
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} /> {/* Ruta principal para la vista de bienvenida */}
        <Route path="/filtrarParada" element={<FiltrarParada />} />
        <Route path="/seleccionarTransporte/:paradaId" element={<SeleccionarTransporte />} />
        <Route path="/mapa" element={<MapView />} />
        <Route path="/mapa/:coban_id" element={<MapView />} />
        <Route path="/horarios" element={<HorariosDisponibles />} />
        <Route path="/paradas-con-transportes" element={<ParadasConTransporte />} /> {/* Ruta para las paradas */}
        <Route path="/faq" element={<FAQ/>} />
        <Route path="/normas-de-uso" element={<Normas/>} />
        <Route path="/politicas" element={<Politicas/>} />
        <Route path="/contacto" element={<Contacto/>} />
      </Routes>
    </Router>
  );
}

export default App;
