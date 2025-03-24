import React from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para navegación programática
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/sideBar.css"; // Importar el CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Sidebar = () => {
  const navigate = useNavigate(); // Inicializa useNavigate

  // Función para manejar la redirección al hacer clic en el botón "Ver Horarios"
  const handleNavigateHorarios = () => {
    navigate("/horarios"); // Redirige a /horarios
  };

  // Función para manejar la redirección al hacer clic en el botón "Ver Paradas con Transporte"
  const handleNavigateParadas = () => {
    navigate("/paradas-con-transportes"); // Redirige a /paradas-con-transportes
  };

    
    const handleNavigateFAQ = () => {
      navigate("/faq"); 
    };

    const handleNavigateNormas = () => {
      navigate("/normas-de-uso"); 
    };

    const handleNavigatePoliticas = () => {
      navigate("/politicas"); 
    };
    const handleNavigateContacto = () => {
      navigate("/contacto"); 
    };

  return (
    <>
      {/* Botón flotante para abrir el Sidebar */}
      <button
        className="sidebar-toggle"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebarMenu"
        aria-controls="sidebarMenu"
      >
        ☰
      </button>

      {/* Sidebar con Bootstrap Offcanvas */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="sidebarMenu"
        aria-labelledby="sidebarMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="sidebarMenuLabel">Menú</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="list-group">
              {/* Botón para redirigir a /horarios */}
              <button
                className="btn btn-light w-100 text-start"
                onClick={handleNavigateHorarios} // Usamos onClick para redirigir
                data-bs-dismiss="offcanvas"
              >
                Ver Horarios
              </button>

              {/* Botón para redirigir a /paradas-con-transportes */}
              <button
                className="btn btn-light w-100 text-start"
                onClick={handleNavigateParadas} // Usamos onClick para redirigir
                data-bs-dismiss="offcanvas"
              >
                Ver Paradas con Transporte
              </button>

            <button
                className="btn btn-light w-100 text-start"
                onClick={handleNavigateFAQ} // Usamos onClick para redirigir
                data-bs-dismiss="offcanvas"
              >
                Preguntas Frecuentes (FAQ)
              </button>

              <button
                className="btn btn-light w-100 text-start"
                onClick={handleNavigateNormas} // Usamos onClick para redirigir
                data-bs-dismiss="offcanvas"
              >
                Normas de Uso
              </button>

              <button
                className="btn btn-light w-100 text-start"
                onClick={handleNavigatePoliticas} // Usamos onClick para redirigir
                data-bs-dismiss="offcanvas"
              >
                Politicas de Privacidad
              </button>

              <button
                className="btn btn-light w-100 text-start"
                onClick={handleNavigateContacto} // Usamos onClick para redirigir
                data-bs-dismiss="offcanvas"
              >
                Contacto
              </button>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
