import React from "react";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';

export const FAQ = () => {
  return (
    <>
    <Navbar logoSrc="/public/logoLetra.png" altText="Logo" />
    <div className="container my-5">
      <h1 className="text-center mb-4">Preguntas Frecuentes (FAQ)</h1>
      <div className="accordion" id="faqAccordion">
        {/* Pregunta 1 */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              ¿Cómo sé qué transporte debo tomar?
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              Puedes filtrar las universidades en la app para ver qué transportes están vinculados a cada una.
            </div>
          </div>
        </div>

        {/* Pregunta 2 */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              ¿Por qué no veo mi ubicación en el mapa?
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              Asegúrate de haber activado los permisos de ubicación en tu dispositivo y de estar conectado a internet.
            </div>
          </div>
        </div>

        {/* Pregunta 3 */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              ¿Cómo sé si el transporte me esperará?
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              Si envías tu ubicación dentro del rango permitido, el conductor recibirá la notificación y decidirá si esperarte o no. Su respuesta te llegará como una notificación.
            </div>
          </div>
        </div>

        {/* Pregunta 4 */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingFour">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFour"
              aria-expanded="false"
              aria-controls="collapseFour"
            >
              ¿Los horarios de los transportes son exactos?
            </button>
          </h2>
          <div
            id="collapseFour"
            className="accordion-collapse collapse"
            aria-labelledby="headingFour"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              Los horarios son aproximados y pueden variar según el tráfico y otras condiciones.
            </div>
          </div>
        </div>

        {/* Pregunta 5 */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingFive">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFive"
              aria-expanded="false"
              aria-controls="collapseFive"
            >
              ¿Cómo reporto un problema con un transporte?
            </button>
          </h2>
          <div
            id="collapseFive"
            className="accordion-collapse collapse"
            aria-labelledby="headingFive"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              Puedes comunicarte con el servicio de soporte en la sección de "Contacto" de la app.
            </div>
          </div>
        </div>

        {/* Pregunta 6 */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingSix">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseSix"
              aria-expanded="false"
              aria-controls="collapseSix"
            >
              ¿Puedo ver un historial de los transportes que he tomado?
            </button>
          </h2>
          <div
            id="collapseSix"
            className="accordion-collapse collapse"
            aria-labelledby="headingSix"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              No, la app solo muestra el estado en tiempo real del transporte, pero no almacena un historial de viajes.
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};