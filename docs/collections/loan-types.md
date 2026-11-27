# Módulo: loan-types

## loanTypes

Contenido de las nueve páginas de tipos de préstamo. Id del documento: el slug (`rapidos`, `online`, `sin-nomina`, `con-asnef`, `urgentes`, `sin-intereses`, `300-euros`, `500-euros`, `1000-euros`). El equipo de Credara mantiene estos documentos. Las entidades se consultan en la colección compartida `lenders`; este módulo no copia sus datos ni sus direcciones de afiliación.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| slug | string | sí | Slug de la página, igual al id del documento |
| title | string | sí | Título visible |
| icon | string | sí | Identificador del icono |
| summary | string | sí | Resumen breve para el índice |
| subtitle | string | sí | Subtítulo de la página |
| tags | array de string | sí | Hasta tres etiquetas destacadas |
| criterion | string | sí | `todas`, `aceptaAsnef`, `sinNomina`, `respuestaMax30`, `primerPrestamoGratis` o `importe:N` |
| requirements | array de string | sí | Requisitos habituales |
| advantages | array de string | sí | Ventajas |
| disadvantages | array de string | sí | Inconvenientes |
| questions | array de map | sí | Preguntas frecuentes; cada map tiene `question` (string) y `answer` (string) |
| related | array de string → loanTypes | sí | Slugs de tipos relacionados existentes |
| metaTitle | string | sí | Título para buscadores |
| metaDescription | string | sí | Descripción para buscadores |
| order | number | sí | Posición en el índice, ascendente |
| active | boolean | sí | Si el tipo aparece públicamente |
| createdAt | timestamp | sí | Alta del documento |

El listado consulta los tipos con `active == true` y los ordena por `order` ascendente. El detalle busca por id de documento y omite los tipos inactivos. Para mostrar entidades según `criterion`, usa únicamente documentos activos de `lenders`: `todas` no agrega filtro; `aceptaAsnef` consulta `acceptsAsnef`; `sinNomina`, `noPayslip`; `respuestaMax30`, `responseMinutes <= 30`; `primerPrestamoGratis`, `firstLoanFree`; e `importe:N` comprueba `minAmount <= N <= maxAmount`. Después ordena las entidades por `recommended` primero y por `name` dentro de cada grupo. No se expone `affiliateUrl`.

Índice compuesto: `active` ascendente + `order` ascendente en `loanTypes` para el listado de tipos activos. Debe declararse en `firestore.indexes.json` durante el paso base.
