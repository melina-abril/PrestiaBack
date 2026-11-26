# Credara · API

API pública de Credara en Node.js 24, Express 5 y TypeScript. No requiere cuenta ni inicio de sesión. Este archivo documenta el backend por separado: `README.md` pertenece a la capa de base de datos en este repositorio.

## Desarrollo

Requiere Node.js 24 o superior y Cloud Firestore. Para usar el emulador local, levanta y carga la base siguiendo `README.md`; escucha en `127.0.0.1:8085` y utiliza el proyecto `demo-app`.

```sh
npm install
npm run dev
```

La API escucha en el puerto `8080` por defecto. Para compilar y arrancar el código compilado:

```sh
npm run build
npm start
```

## Configuración

Copia `.env.example` a `.env` y ajusta sus valores para el entorno. `PORT` permite cambiar el puerto de la API; el proxy del frontend espera `8080`. `FRONT_URL` configura el origen permitido para el frontend, que en desarrollo escucha en `http://localhost:4200`. Para la base local, configura `FIREBASE_PROJECT_ID=demo-app`, `GCLOUD_PROJECT=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. Fuera del emulador, configura el proyecto y las credenciales de Google Cloud según las instrucciones de la base. El backend no crea colecciones ni carga datos: usa las colecciones existentes `lenders`, `loanRequests` y `loanTypes`.

## Endpoints públicos

- `GET /api/health`: estado de la API.
- `POST /api/loan-requests`: crea una solicitud de ofertas.
- `GET /api/loan-requests/:id/offers`: obtiene las ofertas de una solicitud.
- `POST /api/loan-requests/:id/clicks`: registra la elección de una entidad y devuelve el destino.
- `GET /api/lenders`: lista y filtra entidades; admite ofertas destacadas.
- `GET /api/loan-types`: lista los tipos de préstamo activos.
- `GET /api/loan-types/:slug`: obtiene el detalle de un tipo.

## Conexión entre capas

El frontend Angular escucha en `4200` y envía `/api` mediante su proxy a `http://localhost:8080`; configura `FRONT_URL` para permitir ese origen. La API accede a Firestore mediante el SDK de administración: en desarrollo usa el emulador en `127.0.0.1:8085`. El frontend no se conecta directamente a la base. Consulta `README.md` para levantar el emulador y cargar sus datos.
