# Prestia · Base de datos

Cloud Firestore almacena los datos de Prestia. El backend accede mediante el SDK de administrador; las reglas impiden el acceso directo de clientes. Este sitio es público y no requiere cuentas ni inicio de sesión.

## Requisitos

- Node.js 24 o posterior y npm.
- Firebase CLI, incluida en las dependencias de desarrollo.

## Emulador y datos de ejemplo

```sh
npm install
npm run emulator
```

En otra terminal, desde este repositorio:

```sh
npm run seed:emulator
```

El emulador de Firestore escucha en `127.0.0.1:8085` y su panel está en el puerto `4005`. El runner aplica los scripts de `firestore/seeds` en orden de versión y registra los aplicados en `_seedHistory`; no modifiques un script que ya se haya aplicado.

| Orden | Script | Colecciones |
|---|---|---|
| V2 | `firestore/seeds/V2__loan_applications.js` | `lenders`, `loanApplications` |

El simulador de préstamos no crea colecciones. No hay script de core ni V1: la numeración de versiones puede tener huecos. El esquema de las colecciones del módulo está en `docs/collections/loan-applications.md`.

## Proyecto real

Configura `FIREBASE_PROJECT_ID` con el identificador de tu proyecto y `GOOGLE_APPLICATION_CREDENTIALS` con la ruta a una cuenta de servicio autorizada. Después ejecuta:

```sh
npm run seed
npm run deploy:firestore
```

El despliegue publica `firestore.rules` y `firestore.indexes.json`. Los índices compuestos se agregarán cuando las consultas de los módulos los requieran; este archivo inicial no declara ninguno.

## Conexión con las otras capas

El backend corre en el puerto `8080` y utiliza `FIREBASE_PROJECT_ID` (valor de ejemplo: `demo-app`) y `FIRESTORE_EMULATOR_HOST` (valor de ejemplo: `127.0.0.1:8085`) para conectarse al emulador. Configura esas mismas variables en su entorno e inicia el emulador antes del backend. El frontend corre en el puerto `4200`, se comunica con el backend bajo `/api` y no accede directamente a Firestore. Actualmente, la estructura inicial del backend solo expone `GET /api/health`; los endpoints de funcionalidades se incorporarán con sus módulos.
