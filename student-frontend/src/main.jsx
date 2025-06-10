// admin-frontend/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('✅ SW registrado:', reg.scope))
      .catch((err) => console.error('❌ Error al registrar el SW:', err));
  });
}


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
