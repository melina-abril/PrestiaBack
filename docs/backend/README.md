# API de Credara

API pública de comparación de préstamos. No requiere cuentas ni inicio de sesión. Este README está en `docs/backend/` porque el `README.md` de la raíz pertenece a la capa de base de datos del mismo repositorio.

## Requisitos y desarrollo

Requiere Node.js 24 o superior y el emulador de Firestore de la capa de base de datos. Consulta el README de la raíz para iniciarlo y cargar sus datos de ejemplo.

Configura las variables de entorno mediante el `.env.example` del backend: `PORT=8080`, `FRONT_URL=http://localhost:4200`, `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. En el emulador, `GCLOUD_PROJECT` debe identificar el mismo proyecto si se configura. No uses credenciales reales en los archivos del repositorio.

```sh
npm install
npm run dev
```

Para compilar y ejecutar el servidor compilado:

```sh
npm run build
npm start
```

La API escucha en el puerto `8080` y expone `GET /api/health`.

## Endpoints públicos

| Módulo | Endpoints |
| --- | --- |
| Blog | `GET /api/articulos`, `GET /api/articulos/:slug` |
| Contacto | `POST /api/contacto` |
| Solicitudes de ofertas | `POST /api/loan-requests`, `GET /api/loan-requests/:id/offers`, `POST /api/loan-requests/:id/clicks` |
| Comparador de entidades | `GET /api/lenders` |
| Tipos de préstamo | `GET /api/loan-types`, `GET /api/loan-types/:slug` |

El test de préstamos, la calculadora TAE y la página «Cómo funciona» no requieren endpoints: funcionan en el frontend.

## Conexión con las otras capas

El frontend se sirve en `http://localhost:4200` y dirige `/api` a `http://localhost:8080`; configura `FRONT_URL=http://localhost:4200` para permitir ese origen. El backend se conecta a Firestore mediante `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. Las colecciones `articulos`, `mensajesContacto`, `loanRequests`, `loanTypes` y `lenders`, sus índices y sus datos de ejemplo pertenecen a la capa de base de datos; el backend no los crea.
