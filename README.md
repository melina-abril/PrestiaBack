# Base de datos de Credara

Cloud Firestore almacena los datos del comparador público. El backend accede mediante Firebase Admin; el frontend no se conecta directamente a Firestore. Las reglas deniegan el acceso directo desde clientes.

## Desarrollo local

Requiere Node.js 24 o superior. Instala las dependencias y abre el emulador de Firestore:

```sh
npm install
npm run emulator
```

El emulador escucha en `127.0.0.1:8085` y su panel en el puerto `4005`. En otra terminal, aplica los scripts de carga versionados:

```sh
npm run seed:emulator
```

El runner aplica los scripts de `firestore/seeds` en orden de versión y registra los aplicados en `_seedHistory`. También puedes comprobar los scripts con `npm run check`.

| Script | Módulo | Colecciones |
|---|---|---|
| `V1__core.js` | Compartido | `lenders` |
| `V4__loan_requests.js` | Solicitud de ofertas | `loanRequests` |
| `V6__loan_types.js` | Tipos de préstamo | `loanTypes` |
| `V7__blog.js` | Blog | `articulos` |
| `V8__contact.js` | Contacto | `mensajesContacto` |

Los módulos de inicio, simulador, comparador, test de préstamos, calculadora TAE y cómo funciona no crean colecciones propias. Consulta `docs/collections` para conocer los campos y las referencias de cada colección.

## Conexión con las otras capas

Para conectar el backend local al emulador, configura `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085` en su entorno. Su API pública escucha en el puerto `8080` con prefijo `/api`; el frontend escucha en `4200` y dirige `/api` a ese puerto. El backend permite el origen del frontend mediante `FRONT_URL=http://localhost:4200`. El frontend no necesita credenciales ni conexión a Firestore.

## Proyecto de Firebase

Para cargar datos en un proyecto real, configura `FIREBASE_PROJECT_ID` y `GOOGLE_APPLICATION_CREDENTIALS` con un proyecto y unas credenciales proporcionados por su administrador. Ejecuta `npm run seed` para cargar los datos. Revisa la configuración del proyecto de Firebase antes de ejecutar `npm run deploy:firestore` para desplegar las reglas y los índices. No utilices las credenciales del proyecto real con el emulador.
