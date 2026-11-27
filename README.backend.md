# Credara · API

API pública de Credara, desarrollada con Node.js 24, Express 5 y TypeScript. Esta estructura inicial no incluye módulos de negocio. El endpoint disponible es `GET /api/health`.

## Desarrollo

Requiere Node.js 24 o superior y la base Firestore de este repositorio. Sigue las instrucciones del `README.md` de la base para iniciar el emulador en `127.0.0.1:8085`. La API utiliza el proyecto `demo-app` en desarrollo.

```sh
npm install
npm run dev
```

Para compilar y ejecutar:

```sh
npm run build
npm start
```

La API escucha en el puerto 8080 por defecto. Consulta `.env.example` para las variables admitidas por la configuración fija. Para conectarla al emulador, configura `FIREBASE_PROJECT_ID=demo-app`, `GCLOUD_PROJECT=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. Para usar Firestore fuera del emulador, configura las credenciales de servicio fuera del repositorio y el identificador del proyecto correspondiente.

Los módulos y sus endpoints se incorporarán en generaciones posteriores. No se requiere inicio de sesión.
