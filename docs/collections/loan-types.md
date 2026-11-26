# Módulo: loan-types

## loanTypes

Contenido público de los nueve tipos de préstamo. Id del documento: el slug (`rapidos`, `online`, `sin-nomina`, `con-asnef`, `urgentes`, `sin-intereses`, `300-euros`, `500-euros` o `1000-euros`). `related` contiene únicamente slugs de documentos de esta colección.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| slug | string | sí | Slug de la página; coincide con el id del documento |
| title | string | sí | Título visible |
| icon | string | sí | Icono visible del tipo |
| summary | string | sí | Resumen de la tarjeta del índice |
| subtitle | string | sí | Subtítulo de la página de detalle |
| tags | array de string | sí | Hasta tres etiquetas de la cabecera |
| criterion | string | sí | Criterio para seleccionar entidades activas de `lenders`: `todas`, `aceptaAsnef`, `sinNomina`, `respuestaMax30`, `primerPrestamoGratis` o `importe:N` |
| requirements | array de string | sí | Requisitos habituales |
| advantages | array de string | sí | Ventajas del tipo de préstamo |
| disadvantages | array de string | sí | Inconvenientes del tipo de préstamo |
| questions | array de map | sí | Preguntas frecuentes; cada elemento tiene `question` (string) y `answer` (string) |
| related | array de string → loanTypes | sí | Slugs de tipos relacionados |
| metaTitle | string | sí | Título de la página para buscadores |
| metaDescription | string | sí | Descripción de la página para buscadores |
| order | number | sí | Posición en el índice |
| active | boolean | sí | Si el tipo se muestra públicamente |
| createdAt | timestamp | sí | Fecha de alta del documento |

Los criterios se aplican a los campos de `lenders`: `aceptaAsnef` → `acceptsAsnef`, `sinNomina` → `noPayslip`, `respuestaMax30` → `responseMinutes <= 30`, `primerPrestamoGratis` → `firstLoanFree` e `importe:N` → `minAmount <= N <= maxAmount`. `todas` no añade filtros. En todos los casos se incluyen solo entidades con `active: true`. El listado de tipos incluye solo documentos con `active: true`, ordenados por `order`.

Índices compuestos: ninguno; el listado ordena por un único campo y el detalle se obtiene por id. Firestore proporciona índices de un solo campo automáticamente.
