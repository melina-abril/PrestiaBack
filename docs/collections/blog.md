# Módulo: blog

## articles

Artículos del blog cargados por el equipo de Credara. Id del documento: el `slug` fijo del artículo (por ejemplo, `entender-la-tae`). Solo se muestran los artículos con `published: true` y `publishedAt` no posterior al momento de la consulta. Las categorías admitidas son `Préstamos`, `Seguridad`, `ASNEF`, `Educación financiera`, `Consejos` y `Legal`.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| slug | string | sí | Identificador para la URL; coincide con el id del documento |
| title | string | sí | Título visible |
| category | string | sí | Una de las seis categorías admitidas |
| summary | string | sí | Resumen de hasta 200 caracteres |
| imageUrl | string | sí | Dirección de la imagen principal |
| author | string | sí | Nombre visible de quien firma el artículo |
| publishedAt | timestamp | sí | Fecha de publicación |
| updatedAt | timestamp | sí | Fecha de última actualización |
| readingMinutes | number | sí | Tiempo estimado de lectura en minutos |
| sections | array | sí | Mapas `{ id: string, title: string, contentHtml: string }`; `id` identifica la sección en el índice. El backend debe limpiar `contentHtml` antes de servirlo |
| relatedSlugs | array | sí | Slugs de otros documentos de `articles`; el detalle solo presenta los publicados |
| metaTitle | string | sí | Título para buscadores |
| metaDescription | string | sí | Descripción para buscadores |
| published | boolean | sí | Si el artículo está disponible públicamente |
| createdAt | timestamp | sí | Alta del documento |

Índices compuestos para el listado paginado: `published` asc + `publishedAt` desc (todas las categorías); `published` asc + `category` asc + `publishedAt` desc (categoría elegida). El backend excluye además las fechas futuras y cuenta los artículos del filtro para calcular el total de páginas.
