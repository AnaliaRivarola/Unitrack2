import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';
import "../styles/paradasConTransporte.css";

const ParadasConTransporte = () => {
  const [paradas, setParadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParadasConTransportes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5000/api/paradas-con-transportes');
        setParadas(response.data);
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
      <Navbar logoSrc="/public/logoLetra.png" altText="Logo" />
      <Container className="mt-4 mb-5">
        <h2 className="text-center mb-3">🚏 Paradas con Transportes</h2>
        <p className="text-center text-muted mb-4">Visualiza las paradas y los transportes disponibles para cada una.</p>

        {loading && (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Cargando paradas...</p>
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          <Row xs={1} md={2} lg={3} className="g-4">
            {paradas.length > 0 ? (
              paradas.map((parada) => (
                <Col key={parada._id}>
                  <Card className="h-100 shadow-sm border-0">
                    <Card.Body>
                      <Card.Title className="">{parada.nombre}</Card.Title>
                      <Card.Text className="mb-2">
                        📍 <strong>Ubicación:</strong><br />
                        Lat: {parada.ubicacion.latitud} <br />
                        Lng: {parada.ubicacion.longitud}
                      </Card.Text>
                      <Card.Text>
                        <strong>Transportes disponibles:</strong>
                      </Card.Text>
                      {parada.transportes.length > 0 ? (
                        parada.transportes.map((transporte) => (
                          <Badge key={transporte._id} bg="info" className="me-2 mb-2 fs-6">
                            🚍 {transporte.nombre}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted fst-italic">No hay transportes vinculados.</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Alert variant="info" className="text-center w-100">
                No hay paradas disponibles.
              </Alert>
            )}
          </Row>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default ParadasConTransporte;
