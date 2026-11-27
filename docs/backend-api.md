# Credara · API

Backend público en Node.js 24, Express 5 y TypeScript. No requiere inicio de sesión. El archivo `README.md` de la raíz pertenece a la capa de base de datos y no se modifica aquí.

## Desarrollo

Levanta primero el emulador de Firestore y aplica los scripts de carga siguiendo el README de la base de datos. Después ejecuta:

```sh
npm install
npm run dev
```

Para compilar y arrancar la versión compilada:

```sh
npm run build
npm start
```

La API escucha en el puerto 8080 por defecto. `PORT` permite cambiarlo. Para conectarla al emulador, configura `FIREBASE_PROJECT_ID=demo-app`, `GCLOUD_PROJECT=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. La configuración de producción debe apuntar al proyecto de Firestore correspondiente y usar credenciales administradas fuera del repositorio. Consulta `.env.example` y `src/config/env.ts` para las demás opciones de configuración, incluido el origen permitido por CORS.

## Endpoints públicos

Todos los endpoints llevan el prefijo `/api`:

| Módulo | Método y ruta | Función |
|---|---|---|
| Blog | `GET /api/articles` | Lista artículos publicados con filtro por categoría y paginación. |
| Blog | `GET /api/articles/:slug` | Consulta un artículo publicado. |
| Entidades | `GET /api/lenders` | Compara entidades activas o muestra las destacadas. |
| Solicitudes | `POST /api/applications` | Registra una solicitud. |
| Solicitudes | `GET /api/applications/:id/offers` | Obtiene las ofertas de una solicitud. |
| Solicitudes | `POST /api/applications/:id/clicks` | Registra un clic y devuelve la URL de la entidad elegida. |
| Tipos de préstamo | `GET /api/loan-types` | Lista los tipos activos. |
| Tipos de préstamo | `GET /api/loan-types/:slug` | Consulta un tipo activo. |

El simulador avanzado, el test de préstamos, la calculadora TAE y la página «Cómo funciona» no exponen endpoints en esta generación.

## Conexión con otras capas

El frontend se ejecuta en `http://localhost:4200` y envía `/api` mediante su proxy a `http://localhost:8080`; permite ese origen en la configuración CORS del backend. Firestore se ejecuta en desarrollo en `127.0.0.1:8085` con el proyecto `demo-app`. El backend lee y escribe las colecciones `articles`, `applications`, `loanTypes` y `lenders`; los scripts de la capa de base de datos cargan los datos y mantienen sus índices.
