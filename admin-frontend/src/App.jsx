import { useState, useEffect } from 'react';  // Asegúrate de importar ambos
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "shared-frontend/components/Login";
import {AdminDashboard} from '../src/views/AdminDashboard'; // Importa el Dashboard
import { CreateUser } from './views/CreateUser';
import { CrearParada } from './views/CrearParada';
import {EditParada} from './views/EditParada';
import { GestionarParadas } from './views/GestionarParada';
import { GestionarUsuarios } from './views/gestionarUsuarios';
import { CrearHorario } from './views/CrearHorario';
import GestionarHorarios from './views/GestionarHorario';
import { TransporteList } from './views/gestionarTransporte';
import { CrearTransporte } from "./views/CrearTransporte";
import { EditarHorario } from './views/EditHorario'; 

import './App.css';
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/Unitrack') 
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
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-user" element={<CreateUser />} /> {/* Ruta para crear usuario */}
        <Route path="/admin/gestionar-usuarios" element={<GestionarUsuarios />} />
        <Route path="/admin/gestionar-paradas" element={<GestionarParadas />} />
        <Route path="/admin/crear-parada" element={<CrearParada />} />
        <Route path="/admin/editar-parada/:id" element={<EditParada />} />
        <Route path="/admin/crear-horario" element={<CrearHorario />} />
        <Route path="/admin/gestionar-horarios" element={<GestionarHorarios />} />
        <Route path="/admin/gestionar-transporte" element={<TransporteList />} />
        <Route path="/admin/crear-transporte" element={<CrearTransporte />} />
        <Route path="/admin/editar-horario/:id" element={<EditarHorario />} />
      </Routes>
    </Router>
  );
}

export default App;
