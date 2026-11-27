# Credara · Base de datos

Cloud Firestore almacena los datos de Credara. El sitio es público y no requiere inicio de sesión. El frontend no accede directamente a Firestore: consulta la API, que utiliza el SDK de administración. Por eso las reglas de acceso directo permanecen cerradas.

## Desarrollo local

Requiere Node.js 24 o superior. Instala las dependencias e inicia el emulador de Firestore en una terminal:

```sh
npm install
npm run emulator
```

El emulador escucha en `127.0.0.1:8085` y su panel está disponible en el puerto `4005`. En otra terminal, carga los datos de ejemplo:

```sh
npm run seed:emulator
```

El runner aplica los scripts de `firestore/seeds` en orden de versión y registra los aplicados en `_seedHistory`. No modifiques un script ya aplicado; incorpora los cambios en una versión posterior. Para comprobar los scripts, ejecuta `npm run check`.

## Colecciones y orden de carga

| Versión | Script | Colecciones |
|---|---|---|
| 1 | `firestore/seeds/V1__core.js` | `lenders` (compartida) |
| 4 | `firestore/seeds/V4__loan_applications.js` | `applications` |
| 6 | `firestore/seeds/V6__loan_types.js` | `loanTypes` |

Inicio, simulador avanzado y comparador de entidades no crean colecciones propias. Los esquemas de las colecciones están en `docs/collections/`. `_seedHistory` es una colección técnica administrada por el runner. No hay índices compuestos definidos para las consultas actuales; Firestore crea automáticamente los índices de campo único.

## Proyecto real

Configura `FIREBASE_PROJECT_ID` y las credenciales de servicio mediante `GOOGLE_APPLICATION_CREDENTIALS` fuera del repositorio. Sin `FIRESTORE_EMULATOR_HOST`, carga los scripts pendientes y despliega las reglas y los índices:

```sh
npm run seed
npm run deploy:firestore
```

Los datos de ejemplo incluyen direcciones de afiliación bajo `example.com`; sustitúyelas por las acordadas con cada entidad antes de operar.

## Conexión con las otras capas

El backend de este repositorio usa `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085` para conectarse al emulador; configura también `GCLOUD_PROJECT=demo-app` según su README. Conserva los nombres de esas variables al conectar la API a otro proyecto. El backend escucha en el puerto `8080` y expone `/api`; el frontend escucha en el puerto `4200` y dirige `/api` al backend mediante su proxy de desarrollo. El frontend nunca necesita credenciales de Firestore.
