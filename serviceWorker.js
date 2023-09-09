const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration("/");
      if (!registration) {
        const newRegistration = await navigator.serviceWorker.register(
          "/serviceWorker.js",
          {
            scope: "/",
          }
        );
        if (newRegistration.installing) {
          console.log("Installation du service worker en cours");
        } else if (newRegistration.waiting) {
          console.log("Service worker installé");
        } else if (newRegistration.active) {
          console.log("Service worker actif");
        }
      } else {
        console.log("Service worker déjà enregistré");
      }
    } catch (error) {
      console.error(`L'enregistrement a échoué : ${error}`);
    }
  }
};

let token = "";
let isAdmin = false;

self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "SET_TOKEN") {
    token = event.data.token;
    console.log("[SW] token set!");
    cacheToken(token);
  } else if (event.data && event.data.type === "SET_ADMIN") {
    isAdmin = event.data.isAdmin;
    console.log("[SW] isAdmin set!");
    cacheIsAdmin(isAdmin);
  }
});

function cacheToken(token) {
  const cacheName = "token-cache";
  caches.open(cacheName).then(function (cache) {
    cache.put(new Request("/token"), new Response(token));
  });
}

function cacheIsAdmin(isAdmin) {
  const cacheName = "isAdmin-cache";
  caches.open(cacheName).then(function (cache) {
    cache.put(new Request("/isAdmin"), new Response(isAdmin.toString()));
  });
}

const whitelistedPathRegex = /^\/api\/(?!.*\.(?:jpe?g|png)$)[^/]*$/;

const whitelistedOrigins = [
  "http://localhost",
  "http://localhost:5500",
  "http://localhost:5678",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5678",
];

// Version du Service Worker
const version = "v2-PSB";

// Fichiers à mettre en cache
const filesToCache = [
  "/serviceWorker.js",
  "/Frontend/fonctions/adminAccess.js",
  "/Frontend/fonctions/fetchDeleteImage.js",
  "/Frontend/fonctions/getTokenFromCache.js",
  "/Frontend/fonctions/handleDeleteClick.js",
  "/Frontend/fonctions/handlePictureSubmit.js",
  "/Frontend/fonctions/loadModal.js",
  "/Frontend/fonctions/login.js",
  "/Frontend/fonctions/logout.js",
  "/Frontend/fonctions/modale.js",
];
// Vérifie si l'origine est autorisée
function isWhitelistedOrigin(request) {
  const origin = request.origin || request.url;
  return whitelistedOrigins.some((url) => origin.startsWith(url));
}

// Événement d'installation du Service Worker
self.addEventListener("install", function (event) {
  console.log(`[${version}] Installing Service Worker`);

  // Mettre en cache les fichiers de l'application Web
  event.waitUntil(
    caches
      .open(version)
      .then(function (cache) {
        return cache.addAll(filesToCache);
      })
      .then(function () {
        console.log(`[${version}] All required resources have been cached`);
      })
  );
});

// Événement d'activation du Service Worker
self.addEventListener("activate", function (event) {
  console.log(`[${version}] Activating Service Worker`);

  // Supprimer les anciennes versions du cache
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return key !== version;
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
      .then(function () {
        console.log(`[${version}] Service Worker has been activated`);
      })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.open(version).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return (
          response ||
          fetch(event.request).then(function (networkResponse) {
            if (isWhitelistedOrigin(event.request)) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
        );
      });
    })
  );
});

function shouldCacheRequest(request) {
  // Vérifier si la méthode de la requête est POST
  if (request.method === "POST" || "DELETE") {
    console.log("POST request will not be cached.");
    return false;
  }
  return true;
}

registerServiceWorker();
