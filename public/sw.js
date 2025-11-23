const CACHE_NAME = 'lashstudio-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico'
  // adicione aqui outros assets estáticos gerados (ex.: /assets/...), se necessário
];

// Instalação: faz cache dos assets básicos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(() => {
        // ignore failures
      });
    })
  );
  self.skipWaiting();
});

// Ativação: remove caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: estratégia cache-first para recursos estáticos, network-first para /api/
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // não interceptar dev-server websocket ou chrome extension requests
  if (request.method !== 'GET') return;

  // rotas API: network-first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // arquivos estáticos / navigation: cache-first, fallback network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          // opcionalmente cachear novo recurso
          if (response && response.status === 200 && request.destination !== 'document') {
            const resClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, resClone).catch(() => {});
            });
          }
          return response;
        })
        .catch(() => {
          // fallback para document -> serve index.html para SPA
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
