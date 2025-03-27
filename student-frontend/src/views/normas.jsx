import React from "react";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';

export const Normas = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar logoSrc="../src/assets/logoLetra.png" altText="Logo" />
      <div className="page-container flex-grow-1">
      <h1 className="text-center mb-4">Normas de Uso de la Aplicación</h1>
        <div className="container my-5">
          <div className="accordion" id="normasAccordion">
            {/* Norma 1 */}
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
                  Uso Responsable de la Aplicación
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#normasAccordion"
              >
                <div className="accordion-body">
                  La aplicación está diseñada exclusivamente para consultar el estado y ubicación de los transportes universitarios. No se permite el uso de la app para fines distintos a los establecidos.
                </div>
              </div>
            </div>

            {/* Norma 2 */}
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
                  Permisos y Ubicación
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#normasAccordion"
              >
                <div className="accordion-body">
                  Para un correcto funcionamiento, es necesario otorgar permisos de ubicación en tu dispositivo. La opción de "Enviar mi ubicación" solo debe usarse cuando realmente necesites que el conductor te espere.
                </div>
              </div>
            </div>

            {/* Norma 3 */}
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
                  Exactitud de la Información
                </button>
              </h2>
              <div
                id="collapseThree"
                className="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#normasAccordion"
              >
                <div className="accordion-body">
                  La información en la app es en tiempo real, pero puede haber pequeñas variaciones debido a factores externos como el tráfico. Los horarios de los transportes son referenciales y pueden estar sujetos a cambios.
                </div>
              </div>
            </div>

            {/* Norma 4 */}
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
                  Notificaciones y Mensajes del Conductor
                </button>
              </h2>
              <div
                id="collapseFour"
                className="accordion-collapse collapse"
                aria-labelledby="headingFour"
                data-bs-parent="#normasAccordion"
              >
                <div className="accordion-body">
                  Los conductores pueden enviar mensajes informativos como retrasos, capacidad del transporte o cambios en la ruta. Es responsabilidad del usuario revisar las notificaciones en la app.
                </div>
              </div>
            </div>

            {/* Norma 5 */}
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
                  Uso de Datos y Conectividad
                </button>
              </h2>
              <div
                id="collapseFive"
                className="accordion-collapse collapse"
                aria-labelledby="headingFive"
                data-bs-parent="#normasAccordion"
              >
                <div className="accordion-body">
                  La app requiere conexión a internet para actualizar la ubicación de los transportes en tiempo real. Se recomienda utilizar Wi-Fi o un plan de datos adecuado para evitar interrupciones en el servicio.
                </div>
              </div>
            </div>

            {/* Norma 6 */}
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
                  Restricciones y Seguridad
                </button>
              </h2>
              <div
                id="collapseSix"
                className="accordion-collapse collapse"
                aria-labelledby="headingSix"
                data-bs-parent="#normasAccordion"
              >
                <div className="accordion-body">
                  La aplicación no almacena datos personales ni un historial de viajes. No intentes manipular la información de ubicación ni enviar datos falsos.
                </div>
              </div>
            </div>

            {/* Norma 7 */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingSeven">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseSeven"
                  aria-expanded="false"
                  aria-controls="collapseSeven"
                >
                  Soporte y Contacto
                </button>
              </h2>
              <div
                id="collapseSeven"
                className="accordion-collapse collapse"
                aria-labelledby="headingSeven"
                data-bs-parent="#normasAccordion"
              >
                <div className="accordion-body">
                  En caso de problemas técnicos, revisa la sección de ayuda dentro de la aplicación. Para dudas adicionales, puedes comunicarte con el soporte técnico.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Normas;