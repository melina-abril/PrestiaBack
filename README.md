# Prestia · Simulador de préstamos — Firestore

Base de datos Cloud Firestore en modo nativo. Esta estructura inicial no contiene colecciones de negocio, datos de ejemplo ni índices compuestos; se agregarán con los módulos. El sitio es público y no requiere cuentas ni inicio de sesión.

## Requisitos

- Node.js 24 o posterior
- npm
- Java, requerido por el emulador de Firestore

## Desarrollo local

```sh
npm install
npm run emulator
```

El emulador de Firestore escucha en `127.0.0.1:8085` y su interfaz está disponible en `http://127.0.0.1:4005`. En otra terminal, cuando existan scripts de carga:

```sh
npm run seed:emulator
```

También se pueden ejecutar el emulador y la carga juntos con `npm run test:seeds`. El runner aplica los scripts de `firestore/seeds` por versión y registra cuáles se aplicaron. En esta estructura inicial aún no hay scripts.

## Proyecto de Firebase

Para cargar datos en un proyecto real, configura `FIREBASE_PROJECT_ID` y `GOOGLE_APPLICATION_CREDENTIALS` con la ruta de una cuenta de servicio proporcionada por quien administra el proyecto. No guardes el archivo de credenciales en el repositorio. Después ejecuta:

```sh
npm run seed
npm run deploy:firestore
```

El despliegue publica `firestore.rules` y `firestore.indexes.json`. Las reglas deniegan todo acceso directo de clientes; el backend debe acceder mediante el SDK de administración de Firebase. Los índices compuestos se incorporarán cuando los módulos definan consultas que los necesiten.

## Scripts y colecciones

| Paso | Script de carga | Colecciones |
|---|---|---|
| Estructura inicial | Ninguno | Ninguna |

Los módulos posteriores añadirán sus scripts versionados y documentarán sus colecciones en `docs/collections/`.
