import React, { useState } from "react";
import "../styles/sideBar.css"; // Importar el CSS

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sidebar-container">
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2>Menú</h2>
        <ul>
          <li><a href="#">Opción 1</a></li>
          <li><a href="#">Opción 2</a></li>
          <li><a href="#">Opción 3</a></li>
        </ul>
      </div>

      {/* Botón flotante para abrir el sidebar */}
      <button className={`sidebar-toggle ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
    </div>
  );
};

export default Sidebar;
