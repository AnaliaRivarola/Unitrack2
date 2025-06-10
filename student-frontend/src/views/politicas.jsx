import React from "react";
import { Navbar } from 'shared-frontend/components/Navbar';
import { Footer } from 'shared-frontend/components/Footer';

export const Politicas = () => {
  return (
    <>
      <Navbar logoSrc="/public/logoLetra.png" altText="Logo" />
      <div className="container my-5">
        <h1 className="text-center mb-4">Política de Privacidad</h1>
        <p className="text-center text-muted">Última actualización: [23 de marzo del 2025]</p>
        <div className="accordion" id="politicasAccordion">
          {/* Política 1 */}
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
                Actualización y Mejoras
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#politicasAccordion"
            >
              <div className="accordion-body">
                La aplicación está en constante actualización para mejorar su funcionamiento y corregir posibles errores. Si encuentras algún problema, te pedimos que lo reportes para que podamos solucionarlo lo antes posible.
              </div>
            </div>
          </div>

          {/* Política 2 */}
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
              data-bs-parent="#politicasAccordion"
            >
              <div className="accordion-body">
                La app solicita permiso de ubicación únicamente para brindarte información precisa sobre tu posición en relación con los transportes. Tu ubicación no se almacena en ninguna base de datos ni se comparte con terceros. La función de "Enviar mi ubicación" solo se activa si te encuentras a aproximadamente 1 km del transporte y sirve para informar a los conductores sobre tu posible retraso.
              </div>
            </div>
          </div>

          {/* Política 3 */}
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
                Uso Responsable
              </button>
            </h2>
            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#politicasAccordion"
            >
              <div className="accordion-body">
                La aplicación es una herramienta de apoyo para los estudiantes y no garantiza la exactitud total de los horarios o rutas, ya que pueden estar sujetos a cambios por parte de los conductores o factores externos. El uso indebido de la aplicación, como el envío de ubicaciones falsas o el intento de manipular la información en pantalla, no es responsabilidad del desarrollador.
              </div>
            </div>
          </div>

          {/* Política 4 */}
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
                Datos y Privacidad
              </button>
            </h2>
            <div
              id="collapseFour"
              className="accordion-collapse collapse"
              aria-labelledby="headingFour"
              data-bs-parent="#politicasAccordion"
            >
              <div className="accordion-body">
                La aplicación no solicita ni almacena datos personales, contraseñas ni información de usuario. No es necesario iniciar sesión ni proporcionar información personal para acceder a sus funciones.
              </div>
            </div>
          </div>

          {/* Política 5 */}
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
                Responsabilidad del Usuario
              </button>
            </h2>
            <div
              id="collapseFive"
              className="accordion-collapse collapse"
              aria-labelledby="headingFive"
              data-bs-parent="#politicasAccordion"
            >
              <div className="accordion-body">
                La aplicación es una herramienta informativa y no un servicio oficial de transporte. Cualquier inconveniente con el transporte, retrasos o problemas relacionados con el servicio de movilidad es responsabilidad de los operadores de transporte y no de la aplicación o su creador. El desarrollador no se hace responsable por el uso inadecuado de la app ni por decisiones tomadas en base a la información mostrada en ella.
              </div>
            </div>
          </div>

          {/* Política 6 */}
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
                Contacto y Soporte
              </button>
            </h2>
            <div
              id="collapseSix"
              className="accordion-collapse collapse"
              aria-labelledby="headingSix"
              data-bs-parent="#politicasAccordion"
            >
              <div className="accordion-body">
                Si tienes dudas, inconvenientes o sugerencias, puedes comunicarte con el equipo de desarrollo a través de la sección de contacto dentro de la aplicación.
              </div>
            </div>
          </div>
        </div>

      </div>
      <p className="text-center text-muted">Al utilizar esta aplicación, aceptas los términos de esta Política de Privacidad y te comprometes a hacer un uso adecuado de la misma.</p>

      <Footer />
    </>
  );
};

export default Politicas;