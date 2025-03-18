import React, { useState, useEffect } from "react";
import axios from "axios";

export const CrearTransporte = () => {
  const [nombre, setNombre] = useState("");
  const [cobanId, setCobanId] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [paradas, setParadas] = useState([]);
  const [idUsuario, setIdUsuario] = useState("");
  const [paradasSeleccionadas, setParadasSeleccionadas] = useState([]);

  // Obtener usuarios y paradas al cargar el componente
  useEffect(() => {
    axios.get("http://localhost:5000/api/usuarios")
      .then(response => {
        console.log("Usuarios recibidos:", response.data.usuarios); // Accede a la propiedad 'usuarios'
        setUsuarios(response.data.usuarios);  // Cambia 'response.data' por 'response.data.usuarios'
      })
      .catch(error => console.error("Error al obtener usuarios:", error));
  
    axios.get("http://localhost:5000/api/paradas")
      .then(response => setParadas(response.data))
      .catch(error => console.error("Error al obtener paradas:", error));
  }, []);
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevoTransporte = {
        nombre,
        id_usuario: idUsuario,
        coban_id: cobanId,
        paradas: paradasSeleccionadas.map(parada => ({
          parada,
          ubicacion: "Ubicación asignada", // Puedes hacer esto más dinámico
        })),
      };

      await axios.post("http://localhost:5000/api/transportes", nuevoTransporte);
      alert("Transporte creado con éxito");
      setNombre("");
      setCobanId("");
      setIdUsuario("");
      setParadasSeleccionadas([]);
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
          <label>ID de Coban:</label>
          <input type="number" value={cobanId} onChange={(e) => setCobanId(e.target.value)} required />
        </div>

        <div>
          <label>Seleccionar Usuario:</label>
          <select value={idUsuario} onChange={(e) => setIdUsuario(e.target.value)} required>
            <option value="">Seleccione un usuario</option>
            {Array.isArray(usuarios) && usuarios.length > 0 ? (
                usuarios.map(usuario => (
                <option key={usuario._id} value={usuario._id}>
                    {usuario.nombre}
                </option>
                ))
            ) : (
                <option disabled>No hay usuarios disponibles</option>
            )}
        </select>
        </div>

        <div>
  <label>Seleccionar Paradas:</label>
  <select
    value={paradasSeleccionadas}
    onChange={(e) => setParadasSeleccionadas([...e.target.selectedOptions].map(o => o.value))}
    required 
  >
    <option value="">Seleccione una parada</option>
    {paradas.map(parada => (
      <option key={parada._id} value={parada._id}>
        {parada.nombre}
      </option>
    ))}
  </select>
  
</div>

        <button type="submit">Crear Transporte</button>
      </form>
    </div>
  );
};


