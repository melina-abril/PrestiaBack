# Credara · Base de datos

Cloud Firestore en modo nativo. El backend accede mediante el SDK de administración; el frontend no se conecta directamente a Firestore. Las reglas impiden el acceso directo de clientes a todos los documentos.

## Requisitos

Node.js 24 o superior, npm y, para el emulador, una instalación de Java compatible con Firebase Emulator Suite.

## Desarrollo local

```sh
npm install
npm run emulator
```

En otra terminal, carga los scripts versionados:

```sh
npm run seed:emulator
```

El emulador de Firestore escucha en `127.0.0.1:8085` y su panel está en el puerto `4005`. El runner aplica los scripts de `firestore/seeds` por versión y registra cada aplicación en `_seedHistory`. Para revisar los scripts sin cargarlos, ejecuta `npm run check`. También puedes probar la carga en un emulador temporal con `npm run test:seeds`.

## Colecciones y orden de carga

| Script | Colecciones | Uso |
|---|---|---|
| `V1__core.js` | `lenders` | Entidades compartidas por el inicio, el comparador, las solicitudes y las páginas de tipos de préstamo |
| `V4__loan_requests.js` | `loanRequests` | Solicitudes de ofertas |
| `V6__loan_types.js` | `loanTypes` | Páginas de tipos de préstamo |

Los módulos `home`, `loan-simulator` y `lenders` no crean colecciones propias. Consulta `docs/collections/` para el esquema de cada colección. No modifiques un script que ya se haya aplicado: los cambios se incorporan en una versión nueva.

No hay índices compuestos declarados: las consultas especificadas hasta ahora no requieren ninguno. Firestore crea automáticamente los índices de campo único. Si se incorpora una consulta que filtre por un campo y ordene por otro, agrega su índice compuesto a `firestore.indexes.json`.

## Conexión con las otras capas

El backend escucha en el puerto `8080` y se conecta a esta base con `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085` durante el desarrollo local. Configura esas mismas variables en el entorno del backend; su `.env.example` ya está en el repositorio y no se reemplaza aquí. El frontend escucha en el puerto `4200` y llama al backend mediante `/api`, sin acceder directamente a Firestore. La base no requiere cuentas de visitantes ni almacena contraseñas.

## Proyecto real

Configura `FIREBASE_PROJECT_ID` con el identificador de tu proyecto y `GOOGLE_APPLICATION_CREDENTIALS` con la ruta a un archivo de credenciales mantenido fuera del repositorio. No configures `FIRESTORE_EMULATOR_HOST` al cargar datos en un proyecto real. Después ejecuta:

```sh
npm run seed
npm run deploy:firestore
```

El segundo comando despliega `firestore.rules` y `firestore.indexes.json`. Verifica el proyecto de destino antes de cargar datos o desplegar reglas.
