# Credara · Base de datos Firestore

Base de datos del sitio público Credara. El frontend no accede directamente a Firestore: consulta la API, que utiliza el SDK de administración. Las reglas impiden el acceso directo desde clientes. No se generan cuentas, contraseñas ni roles.

## Desarrollo local

Requiere Node.js 24 y npm. En una terminal:

```sh
npm install
npm run emulator
```

El emulador de Firestore escucha en `127.0.0.1:8085` y su panel en el puerto `4005`. En otra terminal, carga los documentos:

```sh
npm run seed:emulator
```

El runner aplica los scripts de `firestore/seeds` en orden de versión y registra los aplicados en `_seedHistory`; no modifiques un script ya aplicado. `npm run check` comprueba el estado de los scripts.

## Scripts y colecciones

| Script | Colecciones |
|---|---|
| `V1__core.js` | `lenders` (compartida) |
| `V4__loan_requests.js` | `loanRequests` |
| `V6__loan_types.js` | `loanTypes` |
| `V7__blog.js` | `articulos` |
| `V8__contact.js` | `mensajesContacto` |

Los módulos de sobre nosotros y textos legales, test de préstamos, calculadora TAE, cómo funciona, inicio, simulador avanzado y comparador no tienen scripts de carga propios. Los esquemas de las colecciones creadas están en `docs/collections/`.

## Despliegue

Configura `FIREBASE_PROJECT_ID` con el identificador de tu proyecto y `GOOGLE_APPLICATION_CREDENTIALS` con la ruta a tus credenciales de servicio antes de ejecutar `npm run seed`. Selecciona el proyecto correcto en Firebase CLI antes de ejecutar `npm run deploy:firestore`, que despliega `firestore.rules` y `firestore.indexes.json`. Las reglas mantienen cerrado el acceso directo a Firestore. El archivo de índices no declara índices compuestos hasta que se verifiquen los campos de las consultas y de los scripts de carga.

## Conexión entre capas

El backend escucha en el puerto `8080` y se conecta al emulador con `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`; configura esas variables en el `.env.example` existente del backend. El frontend escucha en el puerto `4200` y envía sus peticiones `/api` al backend mediante su proxy. No necesita credenciales ni conexión directa a Firestore.
