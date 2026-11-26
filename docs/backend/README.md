# Prestia · API

API pública de Prestia. Esta estructura inicial expone `GET /api/health`; los endpoints de las funcionalidades se agregarán a `src/routes.ts` cuando se generen sus módulos. No requiere inicio de sesión.

## Requisitos

- Node.js 24 o posterior y npm.
- Para las funcionalidades que persistan datos, el emulador de Firestore de la capa database.

## Desarrollo

Consulta `.env.example` para configurar el entorno. El proyecto de Firebase de ejemplo es `demo-app` y el emulador de Firestore escucha en `127.0.0.1:8085`. La API escucha en el puerto 8080 por defecto.

```sh
npm install
npm run dev
```

Para compilar y ejecutar la versión compilada:

```sh
npm run build
npm start
```

## Conexión con la base de datos

La capa database usa Cloud Firestore. En desarrollo, inicia su emulador según las instrucciones del `README.md` de esa capa y configura `FIREBASE_PROJECT_ID=demo-app`, `GCLOUD_PROJECT=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085` para conectar la API. Los archivos de configuración y los scripts de carga de la base pertenecen a esa capa; la API no crea colecciones ni carga datos de ejemplo.
