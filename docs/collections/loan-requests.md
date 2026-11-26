# Módulo: loan-requests

## loanRequests

Solicitudes de ofertas, consentimientos, resultados y clics de seguimiento. Id fijo del documento: `LR-0001`, `LR-0002`… Los teléfonos e IP del seed son valores ficticios. Las ofertas no contienen la URL de afiliado: esta permanece en la colección compartida `lenders` hasta que el backend registra el clic.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| amount | number | sí | Importe solicitado en euros; de 50 a 2.000 en pasos de 50 |
| termDays | number | sí | Plazo solicitado, de 7 a 90 días |
| name | string | sí | Nombre del solicitante |
| birthDate | timestamp | sí | Fecha de nacimiento; edad de 18 a 100 años al solicitar |
| mobile | string | sí | Móvil español de nueve dígitos, sin el prefijo fijo +34 |
| email | string | sí | Correo del solicitante |
| employmentStatus | string | sí | `CUENTA_AJENA`, `AUTONOMO`, `PENSIONISTA`, `DESEMPLEADO_PRESTACION` u `OTROS_INGRESOS` |
| asnef | string | sí | `NO`, `SI` o `NO_SE` |
| acceptsPrivacy | boolean | sí | Aceptación obligatoria de privacidad y términos; debe ser true |
| acceptsCommunications | boolean | sí | Consentimiento opcional para comunicaciones |
| privacyAcceptedAt | timestamp | sí | Fecha de aceptación de privacidad y términos |
| communicationsAcceptedAt | timestamp \| null | no | Fecha de aceptación de comunicaciones; null si no se aceptaron |
| ipAddress | string | sí | IP utilizada para limitar a cinco solicitudes nuevas por hora |
| userAgent | string | sí | Agente del navegador al enviar la solicitud |
| idempotencyKey | string | sí | Clave para identificar reintentos de la misma solicitud |
| status | string | sí | `RECIBIDA`, `OFERTADA` o `SIN_OFERTAS` |
| offers | array | sí | Ofertas guardadas, ordenadas por menor total nuevo y luego por tiempo de respuesta y nombre; vacía antes del análisis o cuando no hay ofertas |
| clicks | array | sí | Un registro por cada clic, incluidos los repetidos; vacía si no hubo clics |
| createdAt | timestamp | sí | Alta del documento |

Cada elemento de `offers` es un mapa con estos campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| lenderId | string → lenders | sí | Entidad que ofrece el préstamo |
| amount | number | sí | Importe ofertado en euros |
| termDays | number | sí | Plazo ofertado en días |
| totalNew | number | sí | Total en euros para cliente nuevo, con intereses redondeados al euro |
| totalReturning | number | sí | Total en euros para cliente recurrente, con intereses redondeados al euro |
| firstLoanFree | boolean | sí | Indica si la entidad ofrece los primeros 30 días sin intereses |
| responseMinutes | number | sí | Tiempo estimado de respuesta en minutos |
| bestOffer | boolean | sí | Marca la primera oferta según el orden de resultados |

Cada elemento de `clicks` es un mapa con estos campos:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| lenderId | string → lenders | sí | Entidad elegida, presente en `offers` |
| clickedAt | timestamp | sí | Fecha del clic para el seguimiento de comisiones |

Índice compuesto: `ipAddress` asc + `createdAt` desc para contar las solicitudes recientes de una IP. El paso base debe incluirlo en `firestore.indexes.json`.
