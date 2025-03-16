import { useState, useEffect } from 'react';  // Asegúrate de importar ambos
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MapView } from "./views/mapChofer";
import { MensajesRapidos } from "./views/mensajes";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

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
  }, []); // Asegúrate de que useEffect esté dentro de la función del componente

  return (
    <Router>
      <Routes>

        <Route path="/chofer/mapa" element={<MapView />} />
        <Route path="/chofer/mensajes" element={<MensajesRapidos />} />

      </Routes>
    </Router>
  );
}

export default App;
