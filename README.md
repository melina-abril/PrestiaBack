# Credara · Cloud Firestore

Base de datos de Credara en Cloud Firestore. El backend accede mediante el SDK de administración; las reglas de acceso directo a Firestore están cerradas. Este repositorio no requiere cuentas para usar el sitio.

## Requisitos y desarrollo local

Requiere Node.js 24 o superior. Instala las dependencias y arranca el emulador de Firestore:

```sh
npm install
npm run emulator
```

El emulador escucha en `127.0.0.1:8085` y su panel está disponible en el puerto `4005`. En otra terminal, aplica los scripts de carga versionados:

```sh
npm run seed:emulator
```

El runner aplica los archivos de `firestore/seeds` por versión y registra los aplicados en `_seedHistory`. Para comprobar los scripts sin aplicarlos, usa `npm run check`.

## Scripts y colecciones

| Script | Colecciones |
|---|---|
| `V1__core.js` | `lenders` |
| `V4__loan_applications.js` | `applications` |
| `V6__loan_types.js` | `loanTypes` |
| `V7__blog.js` | `articles` |
| `V8__contact.js` | `contactMessages` |

Los módulos Sobre nosotros y textos legales, Test de préstamos, Calculadora TAE, Cómo funciona, Inicio, Simulador avanzado y Comparador de entidades no crean colecciones propias. Los esquemas de las colecciones creadas están en `docs/collections/`.

## Proyecto real

Configura `FIREBASE_PROJECT_ID` y las credenciales mediante `GOOGLE_APPLICATION_CREDENTIALS` fuera del repositorio. Después ejecuta:

```sh
npm run seed
npm run deploy:firestore
```

Sustituye las direcciones de afiliación de ejemplo antes de operar. No incluyas credenciales en los scripts de carga.

## Conexión con las otras capas

El backend usa `FIREBASE_PROJECT_ID` y `FIRESTORE_EMULATOR_HOST` para conectarse a Firestore. En desarrollo, utiliza `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`; el backend escucha en el puerto `8080`. El frontend escucha en el puerto `4200`, llama al backend bajo `/api` y no accede directamente a Firestore.
