# Credara · API

Estructura inicial de la API pública. `GET /api/health` está disponible; todavía no hay módulos ni otros endpoints. El archivo `src/routes.ts` está listo para registrar sus routers cuando se generen las funcionalidades.

## Requisitos

- Node.js 24 o superior y npm.
- La base Cloud Firestore de este repositorio en funcionamiento. Consulta el `README.md` de la capa database para arrancar su emulador.

## Desarrollo

```sh
npm install
npm run dev
```

La API escucha en el puerto 8080 por defecto. Para comprobar la compilación y ejecutar la versión compilada:

```sh
npm run build
npm start
```

## Configuración

Consulta el `.env.example` existente para las variables que leen `src/config/env.ts` y `src/config/database.ts`. Para desarrollo local, la base utiliza el proyecto de ejemplo `demo-app` y el emulador de Firestore en `127.0.0.1:8085`. Configura `FIREBASE_PROJECT_ID`, `GCLOUD_PROJECT` y `FIRESTORE_EMULATOR_HOST` según la configuración de esa capa. No incluyas archivos de credenciales en el repositorio.

La API se conecta a Firestore mediante la configuración existente en `src/config/database.ts`; el esquema y los datos de ejemplo corresponden a la capa database. Esta API es pública y no requiere inicio de sesión.
