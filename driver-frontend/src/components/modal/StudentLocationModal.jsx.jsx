import React from "react";
import { Modal, Button } from "react-bootstrap";
import { io } from "socket.io-client";
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io("http://localhost:5000"); // Conexión al backend

const StudentLocationModal = ({ showModal, setShowModal, studentData, setShowChoferModal }) => {

  const handleWaitConfirmation = () => {
    if (studentData) {
      // Enviar evento al backend para que el chofer reciba la confirmación
      socket.emit("choferEsperara", {
        latitud: studentData.latitud,
        longitud: studentData.longitud
      });
      console.log("espera aceptada");
    }
    setShowModal(false); // Cerrar el modal del chofer
    setShowChoferModal(true); // Mostrar el modal de espera confirmada
  };

  const handleNoWaitConfirmation = () => {
    if (studentData) {
      // Enviar evento al backend para que el chofer no espere
      socket.emit("choferNoEsperara", {
        latitud: studentData.latitud,
        longitud: studentData.longitud
      });
      console.log("espera rechazada");
    }
    setShowModal(false); // Cerrar el modal del chofer
    setShowChoferModal(true); // Mostrar el modal indicando que no se espera
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Un estudiante está llegando tarde...</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {studentData ? (
          <>
            <p>Hola! Estoy atrasado, ¿podrías esperarme?</p>
            <p><strong>Latitud:</strong> {studentData.latitud}</p>
            <p><strong>Longitud:</strong> {studentData.longitud}</p>
          </>
        ) : (
          <p>No hay datos de ubicación.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleNoWaitConfirmation}>
          No puedo..
        </Button>
        <Button variant="success" onClick={handleWaitConfirmation}>
          Te esperaré
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudentLocationModal;
