# API de Credara

Backend público de Credara en Node.js 24, Express 5 y TypeScript. No requiere inicio de sesión. Este documento está separado del `README.md` de la capa de base de datos, que comparte el repositorio.

## Desarrollo

Requiere Node.js 24 o superior y la base Cloud Firestore disponible. Para desarrollo local, arranca el emulador de la capa database y aplica sus scripts de carga siguiendo su `README.md`. Después, en el proyecto del backend:

```sh
npm install
npm run dev
```

Para compilar y arrancar el código compilado:

```sh
npm run build
npm start
```

La API escucha en el puerto `8080` por defecto; `PORT` permite cambiarlo. Para el emulador local, configura `FIREBASE_PROJECT_ID=demo-app`, `GCLOUD_PROJECT=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. Configura el origen permitido por CORS para el frontend local (`http://localhost:4200`) mediante la variable de entorno indicada en `src/config/env.ts`. Fuera del emulador, configura las credenciales de Firebase Admin en el entorno; no las incluyas en el repositorio.

## Endpoints públicos

- `GET /api/health`: estado de la API.
- `POST /api/contacto`: recibe mensajes de contacto.
- `GET /api/articles` y `GET /api/articles/:slug`: artículos publicados.
- `GET /api/lenders`: compara entidades activas.
- `POST /api/applications`, `GET /api/applications/:id/offers` y `POST /api/applications/:id/clicks`: solicitudes, ofertas y clics.
- `GET /api/loan-types` y `GET /api/loan-types/:slug`: tipos de préstamo.

Sobre nosotros y textos legales no tiene endpoints propios en esta generación.

## Conexión con las otras capas

El frontend escucha en `http://localhost:4200` y dirige sus peticiones `/api` a este backend en `http://localhost:8080`. El backend accede a Cloud Firestore mediante Firebase Admin; en desarrollo usa el proyecto `demo-app` y el emulador en `127.0.0.1:8085`. Las colecciones y los datos de ejemplo pertenecen a la capa database y se cargan con sus scripts, no al arrancar la API.
