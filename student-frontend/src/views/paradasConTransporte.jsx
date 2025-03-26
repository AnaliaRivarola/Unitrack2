import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';


const ParadasConTransporte = () => {
  const [paradas, setParadas] = useState([]); // Estado para almacenar las paradas con transportes
  const [loading, setLoading] = useState(true); // Estado para mostrar el spinner
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchParadasConTransportes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Llamada a la API para obtener las paradas con transportes vinculados
        const response = await axios.get('http://localhost:5000/api/paradas-con-transportes');
        setParadas(response.data); // Guardamos los datos en el estado
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las paradas con transportes. Intenta nuevamente.');
        setLoading(false);
      }
    };

    fetchParadasConTransportes();
  }, []);

  return (
    <>
    <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
    <Container className="mt-4">
      <Row>
        <Col md={8} className="mx-auto">
          <h3 className="text-center">Paradas con Transportes Vinculados</h3>
          <p className="text-center">Aquí puedes ver las paradas y los transportes asociados a cada una.</p>

          {loading && <Spinner animation="border" variant="primary" className="d-block mx-auto" />}
          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && (
            <ListGroup>
              {paradas.length > 0 ? (
                paradas.map((parada) => (
                  <ListGroup.Item key={parada._id} className="mb-3">
                    <h5>{parada.nombre}</h5>
                    <p><strong>Ubicación:</strong> Latitud {parada.ubicacion.latitud}, Longitud {parada.ubicacion.longitud}</p>
                    <p><strong>Transportes:</strong></p>
                    <ListGroup>
                      {parada.transportes.length > 0 ? (
                        parada.transportes.map((transporte) => (
                          <ListGroup.Item key={transporte._id} className="mb-2">
                            🚍 {transporte.nombre}
                          </ListGroup.Item>
                        ))
                      ) : (
                        <ListGroup.Item>No hay transportes vinculados a esta parada.</ListGroup.Item>
                      )}
                    </ListGroup>
                  </ListGroup.Item>
                ))
              ) : (
                <Alert variant="info">No hay paradas disponibles.</Alert>
              )}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>

    <Footer />
    </>
  );
};

export default ParadasConTransporte;