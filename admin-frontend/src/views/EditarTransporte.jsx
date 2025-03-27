import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';

export const EditarTransporte = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [paradas, setParadas] = useState([]);
  const [gpsDispositivos, setGpsDispositivos] = useState([]);
  const [idUsuario, setIdUsuario] = useState("");
  const [paradasSeleccionadas, setParadasSeleccionadas] = useState([]);
  const [gpsSeleccionado, setGpsSeleccionado] = useState("");

  useEffect(() => {
    const fetchTransporte = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const response = await axios.get(`http://localhost:5000/api/transportes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const transporte = response.data;
        setNombre(transporte.nombre);
        setIdUsuario(transporte.id_usuario);
        setParadasSeleccionadas(transporte.paradas.map((p) => p.parada._id));
        setGpsSeleccionado(transporte.gpsId);
      } catch (error) {
        console.error("Error al cargar el transporte:", error);
        alert("Hubo un error al cargar los datos del transporte.");
      }
    };

    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("admin_token");
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

    const fetchParadas = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/paradas");
        setParadas(response.data);
      } catch (error) {
        console.error("Error al obtener paradas:", error);
      }
    };

    const fetchGpsDispositivos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/gps");
        setGpsDispositivos(response.data);
      } catch (error) {
        console.error("Error al obtener dispositivos GPS:", error);
      }
    };

    fetchTransporte();
    fetchUsuarios();
    fetchParadas();
    fetchGpsDispositivos();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!gpsSeleccionado) {
        alert("Debe seleccionar un GPS para el transporte.");
        return;
      }

      const transporteActualizado = {
        nombre,
        id_usuario: idUsuario,
        paradas: paradasSeleccionadas.map((parada) => ({
          parada,
          ubicacion: "Ubicación asignada",
        })),
        gpsId: gpsSeleccionado,
      };

      const token = localStorage.getItem("admin_token");
      await axios.put(`http://localhost:5000/api/transportes/${id}`, transporteActualizado, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Transporte actualizado con éxito");
      navigate("/admin/gestionar-transporte");
    } catch (error) {
      console.error("Error al actualizar transporte:", error);
      alert("Hubo un error al actualizar el transporte.");
    }
  };

  return (
    <>
      <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Editar Transporte</h2>
        <form onSubmit={handleSubmit} className="card shadow p-4">
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre del Transporte:</label>
            <input
              type="text"
              id="nombre"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="usuario" className="form-label">Seleccionar Usuario:</label>
            <select
              id="usuario"
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
            <label htmlFor="paradas" className="form-label">Seleccionar Paradas:</label>
            <select
              id="paradas"
              className="form-select"
              multiple
              value={paradasSeleccionadas}
              onChange={(e) =>
                setParadasSeleccionadas([...e.target.selectedOptions].map((o) => o.value))
              }
              required
            >
              {paradas.map((parada) => (
                <option key={parada._id} value={parada._id}>
                  {parada.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="gps" className="form-label">Seleccionar GPS:</label>
            <select
              id="gps"
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

          <button type="submit" className="btn btn-primary w-100">Actualizar Transporte</button>
        </form>
      </div>
      <Footer />
    </>
  );
};