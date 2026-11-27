# API de Credara

API pública en Node.js 24, Express 5 y TypeScript. No requiere inicio de sesión.

## Desarrollo

Instala las dependencias y levanta primero Firestore. Para desarrollo local, usa el proyecto `demo-app` y el emulador en `127.0.0.1:8085`. La configuración del backend se toma de `.env.example`; configura `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085` para usar el emulador.

```sh
npm install
npm run dev
```

Para compilar y arrancar el código compilado:

```sh
npm run build
npm start
```

La API escucha en el puerto `8080` por defecto y expone `GET /api/health`. El backend accede a Firestore mediante `firebase-admin`; la carga de datos y los índices pertenecen a la capa database. Consulta el README de esa capa para levantar el emulador y aplicar sus scripts de carga.

## Módulos y endpoints

- Comparador de entidades y ofertas destacadas: `GET /api/lenders`.
- Solicitud y presentación de ofertas: `POST /api/applications`, `GET /api/applications/:id/offers` y `POST /api/applications/:id/clicks`.
- Tipos de préstamo: `GET /api/loan-types` y `GET /api/loan-types/:slug`.
- El simulador avanzado no expone endpoints: sus cálculos se realizan en el frontend.

## Conexión con las otras capas

El frontend escucha en `http://localhost:4200` y dirige `/api` a `http://localhost:8080`; permite ese origen en la configuración CORS del backend. El frontend no accede directamente a Firestore. Para el emulador, el backend utiliza `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`; `GCLOUD_PROJECT` debe referirse al mismo proyecto cuando se configure. Las colecciones utilizadas son `lenders`, `applications` y `loanTypes`.

El archivo `README.md` de la raíz pertenece a la capa database en este repositorio compartido y no se modifica aquí.
