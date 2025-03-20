import React, { useState, useEffect } from "react";
import axios from "axios";

export const CrearTransporte = () => {
  const [nombre, setNombre] = useState("");
  const [cobanId, setCobanId] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [paradas, setParadas] = useState([]);
  const [gpsDispositivos, setGpsDispositivos] = useState([]); // Lista de dispositivos GPS
  const [idUsuario, setIdUsuario] = useState("");
  const [paradasSeleccionadas, setParadasSeleccionadas] = useState([]);
  const [gpsSeleccionado, setGpsSeleccionado] = useState(""); // GPS seleccionado

  // Obtener usuarios, paradas y dispositivos GPS al cargar el componente
  useEffect(() => {
    axios.get("http://localhost:5000/api/paradas")
      .then(response => setParadas(response.data))
      .catch(error => console.error("Error al obtener paradas:", error));

    axios.get("http://localhost:5000/api/gps") // Endpoint para obtener dispositivos GPS
      .then(response => setGpsDispositivos(response.data))
      .catch(error => console.error("Error al obtener dispositivos GPS:", error));
  }, []);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
        const response = await axios.get('http://localhost:5000/api/auth/usuarios', {
          headers: {
            Authorization: `Bearer ${token}`, // Agrega el token en los encabezados
          },
        });

        setUsuarios(response.data.usuarios); // Asigna los usuarios al estado
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevoTransporte = {
        nombre,
        id_usuario: idUsuario,
        paradas: paradasSeleccionadas.map(parada => ({
          parada,
          ubicacion: "Ubicación asignada", // Puedes hacer esto más dinámico
        })),
        gpsId: gpsSeleccionado, // Asociar el GPS seleccionado
      };

      await axios.post("http://localhost:5000/api/transportes", nuevoTransporte);
      alert("Transporte creado con éxito");
      setNombre("");
      setIdUsuario("");
      setParadasSeleccionadas([]);
      setGpsSeleccionado("");
    } catch (error) {
      console.error("Error al crear transporte:", error);
      alert("Hubo un error al crear el transporte");
    }
  };

  return (
    <div>
      <h2>Crear Nuevo Transporte</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del Transporte:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>

        <div>
          <label>Seleccionar Usuario:</label>
          <select value={idUsuario} onChange={(e) => setIdUsuario(e.target.value)} required>
            <option value="">Seleccione un usuario</option>
            {usuarios.map(usuario => (
              <option key={usuario._id} value={usuario._id}>
                {usuario.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Seleccionar Paradas:</label>
          <select
            multiple
            value={paradasSeleccionadas}
            onChange={(e) => setParadasSeleccionadas([...e.target.selectedOptions].map(o => o.value))}
            required
          >
            {paradas.map(parada => (
              <option key={parada._id} value={parada._id}>
                {parada.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Seleccionar GPS:</label>
          <select value={gpsSeleccionado} onChange={(e) => setGpsSeleccionado(e.target.value)}>
            <option value="">Seleccione un GPS</option>
            {gpsDispositivos.map(gps => (
              <option key={gps._id} value={gps._id}>
                {gps.descripcion || gps.dispositivoId}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Crear Transporte</button>
      </form>
    </div>
  );
};


