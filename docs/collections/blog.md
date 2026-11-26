# Módulo: blog

## articulos

Artículos del blog para el listado por categoría y el detalle. Id del documento: su `slug` (por ejemplo, `entender-la-tae`). Solo se muestran los artículos con `publicado` igual a `true` y `fechaPublicacion` no posterior a la fecha actual.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| slug | string | sí | Identificador legible, igual al id del documento |
| titulo | string | sí | Título visible |
| categoria | string | sí | `Préstamos`, `Seguridad`, `ASNEF`, `Educación financiera`, `Consejos` o `Legal` |
| resumen | string | sí | Extracto para el listado, hasta 200 caracteres |
| imagenUrl | string | sí | URL de la imagen del artículo |
| autor | string | sí | Firma del artículo |
| fechaPublicacion | timestamp | sí | Fecha de publicación; orden descendente del listado |
| fechaActualizacion | timestamp | sí | Última actualización del contenido |
| minutosLectura | number | sí | Tiempo estimado de lectura en minutos |
| secciones | array<map> | sí | Secciones ordenadas; cada mapa tiene `id` (string), `titulo` (string) y `contenidoHtml` (string) |
| relacionados | array<string → articulos> | sí | Slugs de artículos relacionados; el servidor solo muestra los publicados |
| metaTitulo | string | sí | Título para buscadores |
| metaDescripcion | string | sí | Descripción para buscadores |
| publicado | boolean | sí | Indica si el artículo puede mostrarse |
| createdAt | timestamp | sí | Alta del documento |

El servidor debe limpiar `contenidoHtml` antes de servirlo; los datos cargados no sustituyen esa validación.

Índices compuestos necesarios para el listado, de más nuevo a más antiguo:

- `publicado` asc + `fechaPublicacion` desc: artículos publicados sin filtro de categoría.
- `categoria` asc + `publicado` asc + `fechaPublicacion` desc: artículos publicados de una categoría.
