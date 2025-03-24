import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { io } from "socket.io-client";
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io("http://localhost:5000");

const ChoferEsperaModal = ({ show, setShow }) => {
  const [showNoWaitModal, setShowNoWaitModal] = useState(false);

  useEffect(() => {
    socket.on("choferNoEsperara", (data) => {
      console.log("🔴 El chofer no esperará:", data);
      setShowNoWaitModal(true); // Mostrar modal de que no te esperan
    });

    // Cleanup when the component unmounts
    return () => {
      socket.off("choferNoEsperara");
    };
  }, []);

  const handleClose = () => setShow(false); // Cerrar el modal cuando el estudiante haga clic en 'Cerrar'

  return (
    <>
      <Modal show={show} onHide={handleClose} centered className="custom-chofer-modal">
        <Modal.Header closeButton>
          <Modal.Title>El chofer te esperará 5 minutos </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          El chofer ha confirmado que esperará por ti maximo hasta 5 minutos luego de llegar al lugar de espera.  ¡Apúrate para llegar!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal cuando el chofer no espera */}
      <Modal show={showNoWaitModal} onHide={() => setShowNoWaitModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>El chofer no te esperará</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          El chofer ha confirmado que no podrá esperarte. ¡Lo siento!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowNoWaitModal(false)}>
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChoferEsperaModal;
