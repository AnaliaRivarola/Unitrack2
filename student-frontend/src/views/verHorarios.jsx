import React, { useEffect, useState } from "react";
import { Table, Container, Spinner } from "react-bootstrap";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';

const HorariosDisponibles = () => {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/horarios") // Ajusta la URL según tu backend
      .then((response) => response.json())
      .then((data) => {
        setHorarios(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error obteniendo los horarios:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
    <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
    <Container className="mt-4">
      <h2 className="text-center mb-4">Horarios Disponibles</h2>
      
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Cargando horarios...</p>
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
          {horarios && horarios.length > 0 ? (
            horarios.map((horario) => (
                <tr key={horario._id}>
                <td>{horario.id_transporte?.nombre || "Sin datos"}</td> {/* Mostrar nombre del transporte */}
                <td>{horario.hora_salida || "Sin datos"}</td>
                <td>{horario.hora_regreso || "Sin datos"}</td>
                <td>{horario.origen || "Sin datos"}</td>
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
    <Footer />
    </>
  );
};

export default HorariosDisponibles;
