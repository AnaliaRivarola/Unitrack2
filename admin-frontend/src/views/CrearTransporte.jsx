import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select"; // Importa react-select
import { Navbar } from 'shared-frontend/components/Navbar';  // Asegúrate de que el Navbar esté importado
import { Footer } from 'shared-frontend/components/Footer';

export const CrearTransporte = () => {
  const [nombre, setNombre] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [paradas, setParadas] = useState([]);
  const [gpsDispositivos, setGpsDispositivos] = useState([]);
  const [idUsuario, setIdUsuario] = useState("");
  const [paradasSeleccionadas, setParadasSeleccionadas] = useState([]);
  const [gpsSeleccionado, setGpsSeleccionado] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/paradas")
      .then((response) => setParadas(response.data))
      .catch((error) => console.error("Error al obtener paradas:", error));

    axios.get("http://localhost:5000/api/gps")
      .then((response) => setGpsDispositivos(response.data))
      .catch((error) => console.error("Error al obtener dispositivos GPS:", error));
  }, []);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/auth/usuarios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsuarios(response.data.usuarios);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!gpsSeleccionado) {
        alert("Debe seleccionar un GPS para el transporte.");
        return;
      }

      const nuevoTransporte = {
        nombre,
        id_usuario: idUsuario,
        paradas: paradasSeleccionadas.map((parada) => ({
          parada,
          ubicacion: "Ubicación asignada",
        })),
        gpsId: gpsSeleccionado,
      };

      console.log("Datos enviados al backend:", nuevoTransporte);

      // Obtén el token del almacenamiento local
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No se encontró un token de autenticación. Por favor, inicia sesión.");
        return;
      }

      // Envía la solicitud POST con el token en los encabezados
      await axios.post("http://localhost:5000/api/transportes", nuevoTransporte, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  // Convierte las paradas en un formato compatible con react-select
  const opcionesParadas = paradas.map((parada) => ({
    value: parada._id,
    label: parada.nombre,
  }));

  return (
    <>
    <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
    <div className="container mt-5">
      <h2 className="text-center mb-4">Crear Nuevo Transporte</h2>
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Nombre del Transporte:</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Seleccionar Usuario:</label>
          <select
            className="form-select"
            value={idUsuario}
            onChange={(e) => setIdUsuario(e.target.value)}
            required
          >
            <option value="">Seleccione un usuario</option>
            {usuarios.map((usuario) => (
              <option key={usuario._id} value={usuario._id}>
                {usuario.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Seleccionar Paradas:</label>
          <Select
            isMulti
            options={opcionesParadas}
            value={paradasSeleccionadas.map((id) =>
              opcionesParadas.find((op) => op.value === id)
            )}
            onChange={(selectedOptions) =>
              setParadasSeleccionadas(selectedOptions.map((option) => option.value))
            }
            placeholder="Seleccione las paradas..."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Seleccionar GPS:</label>
          <select
            className="form-select"
            value={gpsSeleccionado}
            onChange={(e) => setGpsSeleccionado(e.target.value)}
          >
            <option value="">Seleccione un GPS</option>
            {gpsDispositivos.map((gps) => (
              <option key={gps._id} value={gps._id}>
                {gps.descripcion || gps.dispositivoId}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Crear Transporte
        </button>
      </form>
    </div>
    <Footer />
    </>
  );
};


