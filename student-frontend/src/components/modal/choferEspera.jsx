import React from "react";
import { Modal, Button } from "react-bootstrap";
import { io } from "socket.io-client";
import 'bootstrap/dist/css/bootstrap.min.css';
const socket = io("http://localhost:5000"); // Conexión al backend

const ChoferEsperaModal = ({ show, setShow }) => {
  const handleClose = () => setShow(false); // Cerrar el modal cuando el estudiante haga clic en 'Cerrar'

  return (
    <Modal show={show} onHide={handleClose} centered className="custom-chofer-modal">
      <Modal.Header closeButton>
        <Modal.Title>El chofer te esperará</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        El chofer ha confirmado que esperará por ti. ¡Apúrate para llegar!
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Entendido
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChoferEsperaModal;

