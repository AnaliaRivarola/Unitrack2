import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/filtrarParada.css";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';
import { Container, Row, Col, Form, InputGroup, ListGroup, Alert } from 'react-bootstrap';
import { FaUniversity, FaSearchLocation } from "react-icons/fa";

function FiltrarParada() {
  const [paradas, setParadas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredParadas, setFilteredParadas] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleParadaSelect = (paradaId) => {
    navigate(`/seleccionarTransporte/${paradaId}`);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar logoSrc="/public/logoLetra.png" altText="Logo" />
      <div className="page-container flex-grow-1">
        <Container className="mt-4 mb-5">
          {error && <Alert variant="danger">{error}</Alert>}
          
          <h3 className="titulo mb-4">
            <FaSearchLocation className="me-2 text-primary" />
            Busca tu Universidad
          </h3>

          <Row className="justify-content-center">
            <Col xs={12} sm={10} md={8}>
              <InputGroup className="mb-4 shadow-sm">
                <Form.Control
                  type="text"
                  placeholder="Ej: Universidad Nacional"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-pill px-4 py-2"
                />
              </InputGroup>

              <ListGroup className="rounded-4 shadow-sm">
                {filteredParadas.length > 0 ? (
                  filteredParadas.map(parada => (
                    <ListGroup.Item 
                      key={parada._id} 
                      action 
                      onClick={() => handleParadaSelect(parada._id)}
                      className="d-flex align-items-start justify-content-between parada-item"
                    >
                      <div>
                        <h5 className="mb-1">
                          <FaUniversity className="me-2 text-secondary" />
                          {parada.nombre}
                        </h5>
                        <small className="text-muted">
                          Lat: {parada.ubicacion.latitud} | Lng: {parada.ubicacion.longitud}
                        </small>
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
      </div>
      <Footer />
    </div>
  );
}

export default FiltrarParada;
