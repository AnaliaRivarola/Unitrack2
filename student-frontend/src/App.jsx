// App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import FiltrarParada from './views/filtrarParada';  // Importar FiltrarParada
import { MapView } from './views/map';
import SeleccionarTransporte from './views/seleccionarTransporte';  // Importar SeleccionarTransporte
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "leaflet/dist/leaflet.css";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/Unitrack')  // Cambia esto si tu ruta de API es diferente
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
        <Route path="/filtrarParada" element={<FiltrarParada />} />
        <Route path="/seleccionarTransporte/:paradaId" element={<SeleccionarTransporte />} />
        <Route path="/mapa" element={<MapView />} />
      </Routes>
    </Router>
  );
}

export default App;
