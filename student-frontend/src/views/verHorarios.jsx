import React, { useEffect, useState } from "react";
import { Table, Container, Spinner } from "react-bootstrap";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';
import "../styles/verHorarios.css"; // Asegúrate de que el CSS esté en la ruta correcta

const HorariosDisponibles = () => {
  const [horarios, setHorarios] = useState([]);
  const [todosHorarios, setTodosHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/horarios") // Ajusta la URL según tu backend
      .then((response) => response.json())
      .then((data) => {
        setHorarios(data);
        setTodosHorarios(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error obteniendo los horarios:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
      <div className="page-container flex-grow-1">
        <Container className="mt-4">
          <div className="text-center bg-light p-3 rounded shadow-sm mb-4">
            <h2 className="mb-0 text-primary">📅 Horarios Disponibles</h2>
          </div>

          {!loading && (
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Buscar por transporte..."
              onChange={(e) => {
                const texto = e.target.value.toLowerCase();
                const filtrados = todosHorarios.filter((h) =>
                  h.id_transporte?.nombre?.toLowerCase().includes(texto)
                );
                setHorarios(filtrados);
              }}
            />
          )}

          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "200px" }}>
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Cargando horarios...</p>
          </div>
          ) : (
            <Table striped bordered hover responsive className="shadow">
              <thead className="bg-primary text-white">
                <tr>
                  <th>Transporte</th>
                  <th>Hora de Salida</th>
                  <th>Hora de Regreso</th>
                  <th>Origen de Salida</th>
                </tr>
              </thead>
              <tbody>
                {horarios.length > 0 ? (
                  horarios.map((horario) => (
                    <tr key={horario._id}>
                      <td>{horario.id_transporte?.nombre || <td className="text-muted fst-italic">No disponible</td>}</td>
                      <td>{horario.hora_salida || <td className="text-muted fst-italic">No disponible</td>}</td>
                      <td>{horario.hora_regreso || <td className="text-muted fst-italic">No disponible</td>}</td>
                      <td>{horario.origen || <td className="text-muted fst-italic">No disponible</td>}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No hay horarios disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default HorariosDisponibles;
