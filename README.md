# Credara · Base de datos Firestore

Base Cloud Firestore en modo nativo. El sitio es público y no requiere cuentas. Las reglas impiden el acceso directo desde clientes; el backend accede mediante el SDK de administración.

## Requisitos

- Node.js 24 o superior.
- Java para ejecutar el emulador de Firestore.

## Desarrollo local

```sh
npm install
npm run emulator
```

El emulador escucha en `127.0.0.1:8085` y su panel está en el puerto `4005`. En otra terminal, cuando existan scripts de carga:

```sh
npm run seed:emulator
```

Los scripts de `firestore/seeds` se aplican por orden de versión. El runner registra los ya aplicados para no repetirlos. Esta estructura inicial aún no contiene colecciones ni scripts de carga.

## Proyecto real

Configura un proyecto de Firebase y las credenciales de una cuenta de servicio fuera del repositorio. Establece `GOOGLE_APPLICATION_CREDENTIALS` con la ruta de ese archivo y `FIREBASE_PROJECT_ID` con el identificador del proyecto. Después de generar los scripts de carga, ejecuta `npm run seed`. Para desplegar las reglas y los índices, ejecuta `npm run deploy:firestore` con el proyecto de Firebase seleccionado.

## Archivos de esquema

| Archivo | Contenido |
|---|---|
| `firestore.rules` | Acceso directo denegado para todas las colecciones. |
| `firestore.indexes.json` | Sin índices compuestos hasta que los módulos definan consultas que los necesiten. |

La documentación de las colecciones y sus scripts versionados se incorporarán con los módulos.
