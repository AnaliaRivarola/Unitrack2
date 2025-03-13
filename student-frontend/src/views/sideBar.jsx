import React from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para navegación programática
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/sideBar.css"; // Importar el CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Sidebar = () => {
  const navigate = useNavigate(); // Inicializa useNavigate

  // Función para manejar la redirección al hacer clic en el botón
  const handleNavigate = () => {
    navigate("/horarios"); // Redirige a /horarios
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
            <li className="list-group-item">
              {/* Botón para redirigir a /horarios */}
              <button
                className="btn btn-light w-100 text-start"
                onClick={handleNavigate} // Usamos onClick para redirigir
                data-bs-dismiss="offcanvas"
              >
                Ver Horarios
              </button>
            </li>
            <li className="list-group-item">
              <a href="#" className="text-decoration-none" data-bs-dismiss="offcanvas">Opción 2</a>
            </li>
            <li className="list-group-item">
              <a href="#" className="text-decoration-none" data-bs-dismiss="offcanvas">Opción 3</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
