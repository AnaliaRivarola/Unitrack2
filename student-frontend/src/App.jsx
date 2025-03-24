// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    axios.get('https://unitrack2.onrender.com/Unitruck') // Cambia esto si tu ruta de API es diferente
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

      </Routes>
    </Router>
  );
}

export default App;
