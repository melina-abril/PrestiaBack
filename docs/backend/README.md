# Prestia · API

API pública de Prestia, desarrollada con Node.js 24, Express 5 y TypeScript. No requiere inicio de sesión.

## Desarrollo

Requiere Node.js 24 o posterior. Instala las dependencias, inicia el emulador de Firestore y carga sus datos de ejemplo siguiendo el README de la base de datos. Después, inicia la API:

```sh
npm install
npm run dev
```

Para compilar y ejecutar la versión compilada:

```sh
npm run build
npm start
```

La API escucha en el puerto `8080` y expone sus rutas bajo `/api`.

## Configuración

Consulta el archivo fijo `.env.example` para las variables que lee la API. En desarrollo, configura `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085` para conectarte al emulador. Configura el origen permitido por CORS para el frontend en `http://localhost:4200` mediante la variable de entorno prevista por `src/config/env.ts`.

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Estado de la API. |
| POST | `/api/loan-applications` | Guarda una solicitud de préstamo. |
| GET | `/api/loan-applications/:id/offers` | Obtiene las ofertas de una solicitud. |

## Conexión con las otras capas

El frontend se ejecuta en el puerto `4200` y envía las solicitudes bajo `/api` a esta API en `http://localhost:8080` mediante su proxy de desarrollo. Esta API se conecta a Cloud Firestore; en desarrollo, el emulador usa el proyecto `demo-app` y escucha en `127.0.0.1:8085`. Las colecciones `lenders` y `loanApplications` y sus datos de ejemplo pertenecen a la capa de base de datos. Su README principal se conserva en la raíz del repositorio.
