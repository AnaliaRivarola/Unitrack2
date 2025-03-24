import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Button, Alert, Spinner } from 'react-bootstrap';
import "../styles/seleccionarTransporte.css";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';

function SeleccionarTransportes() {
  const { paradaId } = useParams();  // Obtenemos el ID de la parada desde los parámetros de la URL
  const [transportes, setTransportes] = useState([]);  // Para almacenar los transportes disponibles
  const [loading, setLoading] = useState(true);  // Para mostrar un spinner mientras se cargan los datos
  const [error, setError] = useState(null);  // Para manejar errores en la petición
  const navigate = useNavigate();  // Usamos navigate para redirigir al mapa

  useEffect(() => {
    const fetchTransportes = async () => {
      if (paradaId) {
        setLoading(true);
        setError(null);  // Restablecemos el error antes de hacer la solicitud
        try {
          const response = await axios.get(`https://unitrack2.onrender.com//api/transportes?paradaId=${paradaId}`);
          setTransportes(response.data);  // Guardamos los transportes obtenidos
          setLoading(false);  // Terminamos de cargar
        } catch (error) {
          setError('Error al obtener los transportes. Intenta nuevamente más tarde.');  // Si ocurre un error
          setLoading(false);
        }
      }
    };

    fetchTransportes();
  }, [paradaId]);  // Este efecto depende del `paradaId`, se vuelve a ejecutar cuando cambia

  const handleViewMap = () => {
    navigate('/mapa');  // Redirigimos al mapa
  };

  return (
    <>
    <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}  {/* Si hay un error, lo mostramos */}

      <Row>
        <Col md={8} className="mx-auto">
          <h3>Transportes disponibles para esta parada</h3>
          <p>Esta es una guia para que sepas que transportes pasan por las paradas que seleccionaste</p>
          {loading ? (
            <Spinner animation="border" variant="primary" /> 
          ) : (
            <ListGroup className="mt-4">
              {transportes.length > 0 ? (
                transportes.map(transporte => (
                  <ListGroup.Item key={transporte.coban_id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>{transporte.nombre}</h5>  {/* Nombre del transporte */}
                      <p>Otra info que no se que puede ser</p>  {/* Aquí puedes agregar más detalles si lo deseas */}
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No hay transportes disponibles para esta parada</ListGroup.Item> 
              )}
            </ListGroup>
          )}

          {/* Botón para redirigir al mapa */}
          <Button 
            variant="primary" 
            onClick={handleViewMap} 
            className="mt-4"
          >
            Ver Mapa
          </Button>
        </Col>
      </Row>
    </Container>
    <Footer />
    </>
  );
}

export default SeleccionarTransportes;
