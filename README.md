# Credara · Base de datos

Base de datos Cloud Firestore de Credara. Los scripts versionados cargan datos de ejemplo y el runner registra los scripts aplicados en `_seedHistory`. El acceso público al sitio no implica acceso directo a Firestore: las reglas cierran todas las lecturas y escrituras de clientes; el backend utiliza el SDK de administración.

## Desarrollo local

Requiere Node.js 24 o superior. Instala las dependencias e inicia el emulador de Firestore en `127.0.0.1:8085`; el panel está en el puerto `4005`:

```sh
npm install
npm run emulator
```

En otra terminal, carga los datos de ejemplo:

```sh
npm run seed:emulator
```

También puedes comprobar los scripts con `npm run check`. No modifiques un script que ya se haya aplicado: los cambios de datos se incorporan en un script con una versión posterior.

## Colecciones y orden de carga

| Script | Módulo | Colecciones |
|---|---|---|
| `V1__core.js` | Core compartido | `lenders` |
| `V4__loan_applications.js` | Solicitud de ofertas | `applications` |
| `V6__loan_types.js` | Tipos de préstamo | `loanTypes` |
| `V7__blog.js` | Blog | `articles` |
| `V8__contact.js` | Contacto | `contactMessages` |

El inicio, el simulador avanzado, el comparador de entidades, el test de préstamos, la calculadora TAE y la página «Cómo funciona» no crean colecciones propias. Los esquemas de las colecciones cargadas están en `docs/collections/`.

## Conexión con las otras capas

El backend HTTP escucha en el puerto `8080` y se conecta al emulador con `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`; su documentación también indica configurar `GCLOUD_PROJECT=demo-app`. El frontend escucha en el puerto `4200` y llama al backend bajo `/api`; no accede directamente a Firestore.

## Proyecto de Firebase

Para cargar datos fuera del emulador, configura `FIREBASE_PROJECT_ID` y `GOOGLE_APPLICATION_CREDENTIALS` para el proyecto correspondiente y ejecuta `npm run seed`. Verifica el proyecto de destino antes de hacerlo. Despliega las reglas y los índices con:

```sh
npm run deploy:firestore
```

`firestore.indexes.json` no declara índices compuestos: no hay consultas compuestas especificadas en esta generación. Los índices de campo único los administra Firestore.
