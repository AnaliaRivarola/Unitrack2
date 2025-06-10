const CACHE_NAME = 'cache-student';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',

  // Archivos principales
  '/src/main.jsx',
  '/src/App.jsx',

  // Estilos
  '/src/styles/mapa.css',

  // Assets (íconos e imágenes)
  '/src/assets/icono2.png',
  '/src/assets/student.png',
  '/src/assets/parada.png',

  // Vistas esenciales
  '/src/views/map.jsx',
  '/src/views/sideBar.jsx',
  '/src/views/seleccionarTransporte.jsx',
  '/src/views/verHorarios.jsx',
  '/src/views/contacto.jsx',
  '/src/views/faq.jsx',
  '/src/views/filtrarParada.jsx',
  '/src/views/normas.jsx',
  '/src/views/politicas.jsx',
  '/src/views/welcome.jsx',
  '/src/views/paradasConTransporte.jsx',
];

// Evento de instalación (instala y cachea archivos)
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Evento de activación (limpia caches antiguos)
self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      )
    )
  );
});

// Intercepta requests y responde con cache si existe
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
