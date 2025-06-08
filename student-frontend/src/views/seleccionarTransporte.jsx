import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Button, Alert, Spinner } from 'react-bootstrap';
import { FaBusAlt } from 'react-icons/fa';
import "../styles/seleccionarTransporte.css";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';

function SeleccionarTransportes() {
  const { paradaId } = useParams();
  const [transportes, setTransportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransportes = async () => {
      if (paradaId) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`http://localhost:5000/api/transportes?paradaId=${paradaId}`);
          setTransportes(response.data);
          setLoading(false);
        } catch (error) {
          setError('Error al obtener los transportes. Intenta nuevamente más tarde.');
          setLoading(false);
        }
      }
    };
    fetchTransportes();
  }, [paradaId]);

  const handleViewMap = () => {
    navigate('/mapa');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
      <div className="page-container flex-grow-1 animate__animated animate__fadeIn">
        <Container className="mt-4">
          {error && <Alert variant="danger">{error}</Alert>}

          <Row>
            <Col md={8} className="mx-auto text-center">
              <h3 className="text-primary fw-bold mb-2">Transportes Disponibles</h3>
              <p className="text-muted">Universidad seleccionada: muestra todos los transportes disponibles</p>
              {loading ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <ListGroup className="mt-4">
                  {transportes.length > 0 ? (
                    transportes.map((transporte) => (
                      <ListGroup.Item
                        key={transporte.coban_id}
                        className="d-flex justify-content-start align-items-center gap-3 list-item-custom"
                      >
                        <FaBusAlt className="bus-icon" />
                        <div>
                          <h5 className="mb-1 fw-semibold">{transporte.nombre}</h5>
                          <small className="text-muted">ID del GPS: {transporte.coban_id}</small>
                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item>No hay transportes disponibles para esta universidad.</ListGroup.Item>
                  )}
                </ListGroup>
              )}

              <Button variant="primary" onClick={handleViewMap} className="mt-4 btn-ir-mapa">
                Ver Mapa
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
}

export default SeleccionarTransportes;
