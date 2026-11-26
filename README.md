# Credara · Base de datos

Base Cloud Firestore en modo nativo. Esta estructura inicial no incluye colecciones, datos de ejemplo ni índices compuestos; se incorporarán con las funcionalidades.

## Requisitos

- Node.js 24 o superior y npm.
- Java para ejecutar el emulador de Firestore.

## Desarrollo local

```sh
npm install
npm run emulator
```

En otra terminal, carga los scripts versionados disponibles:

```sh
npm run seed:emulator
```

El emulador de Firestore escucha en `127.0.0.1:8085` y su panel está en el puerto `4005`. El runner aplica los scripts de `firestore/seeds` en orden de versión y registra cuáles ha aplicado. En esta estructura inicial todavía no hay scripts que aplicar.

## Proyecto de Firebase

Para cargar datos en un proyecto real, configura `GOOGLE_APPLICATION_CREDENTIALS` con la ruta de un archivo de credenciales proporcionado por el responsable del proyecto y `FIREBASE_PROJECT_ID` con el identificador del proyecto. Después ejecuta:

```sh
npm run seed
npm run deploy:firestore
```

Revisa el proyecto de destino antes del despliegue. Las reglas actuales deniegan todo acceso directo de clientes a Firestore; el backend utiliza el SDK de administración. No incluyas archivos de credenciales en el repositorio.

## Colecciones y scripts

| Origen | Colecciones |
|---|---|
| Estructura inicial | Ninguna |

Los módulos posteriores documentarán sus colecciones en `docs/collections/` y añadirán scripts versionados a `firestore/seeds/`. No modifiques scripts que ya se hayan aplicado.
