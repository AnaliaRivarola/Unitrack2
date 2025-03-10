import { useState, useEffect } from 'react';  // Asegúrate de importar ambos
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
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
    <>
      <div>
        <h3>Front del chofer</h3>
      </div>
    </>
  );
}

export default App;
