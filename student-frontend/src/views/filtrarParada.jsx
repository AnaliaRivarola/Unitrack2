import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/filtrarParada.css";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';
import { Container, Row, Col, Form, InputGroup, ListGroup, Alert } from 'react-bootstrap';

function FiltrarParada() {
  const [paradas, setParadas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredParadas, setFilteredParadas] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Obtener paradas desde la API
  useEffect(() => {
    axios.get('http://localhost:5000/api/paradas')
      .then(response => {
        setParadas(response.data);
        setFilteredParadas(response.data);
      })
      .catch(error => {
        console.error('Error al obtener paradas:', error);
        setError('No se pudieron cargar las paradas. Intenta nuevamente más tarde.');
      });
  }, []);

  // Filtrar las paradas
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredParadas(paradas);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      setFilteredParadas(
        paradas.filter(parada => 
          parada.nombre.toLowerCase().includes(lowercasedSearchTerm) ||
          parada.ubicacion.latitud.toString().includes(lowercasedSearchTerm) || 
          parada.ubicacion.longitud.toString().includes(lowercasedSearchTerm)
        )
      );
    }
  }, [searchTerm, paradas]);

  // Redirigir a la vista de seleccionar transporte
  const handleParadaSelect = (paradaId) => {
    navigate(`/seleccionarTransporte/${paradaId}`);
  };

  return (
    <>
    <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
    <Container className="mt-4">
      {/* Mensaje de error */}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={6} className="mx-auto">
          <Form>
            <Form.Group controlId="searchTerm">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Buscar parada por nombre o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
          </Form>
        </Col>
      </Row>

      {/* Resultados de la búsqueda */}
      <Row className="mt-4">
        <Col md={6} className="mx-auto">
          <ListGroup>
            {filteredParadas.length > 0 ? (
              filteredParadas.map(parada => (
                <ListGroup.Item 
                  key={parada._id} 
                  action 
                  onClick={() => handleParadaSelect(parada._id)}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h5 className="mb-1">{parada.nombre}</h5>
                    <small>Latitud: {parada.ubicacion.latitud}, Longitud: {parada.ubicacion.longitud}</small>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No se encontraron paradas</ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>
    <Footer />
    </>
  );
}

export default FiltrarParada;
