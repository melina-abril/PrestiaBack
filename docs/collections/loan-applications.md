# Módulo: loan-applications

## applications

Solicitudes públicas de ofertas. Id del documento: código fijo (`APP-0001`, `APP-0002`…). `offers` y `clicks` son listas dentro del documento; no son colecciones independientes. Las ofertas no contienen direcciones de afiliación: el backend consulta la entidad y entrega la dirección de destino únicamente después de registrar el clic.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| amount | number | sí | Importe solicitado en euros, entre 50 y 2000, en pasos de 50 |
| termDays | number | sí | Plazo solicitado en días, entre 7 y 90 |
| name | string | sí | Nombre declarado por el solicitante |
| birthDate | timestamp | sí | Fecha de nacimiento; edad admitida de 18 a 100 años |
| mobile | string | sí | Móvil español de nueve dígitos, sin el prefijo fijo +34 |
| email | string | sí | Correo del solicitante |
| employmentStatus | string | sí | `CUENTA_AJENA`, `AUTONOMO`, `PENSIONISTA`, `DESEMPLEADO_PRESTACION` u `OTROS_INGRESOS` |
| asnefStatus | string | sí | `NO`, `SI` o `NO_SE` |
| privacyAccepted | boolean | sí | Aceptación obligatoria de privacidad y términos; siempre `true` en una solicitud válida |
| privacyAcceptedAt | timestamp | sí | Fecha de aceptación de privacidad y términos |
| marketingAccepted | boolean | sí | Consentimiento opcional de comunicaciones; `false` si no se marca |
| marketingAcceptedAt | timestamp \| null | no | Fecha de aceptación de comunicaciones, o `null` si no se marcaron |
| ipAddress | string | sí | IP de origen para limitar nuevas solicitudes por hora |
| userAgent | string | sí | Agente del navegador registrado al enviar |
| idempotencyKey | string | sí | Clave enviada por el cliente para evitar solicitudes duplicadas |
| status | string | sí | `RECIBIDA`, `OFERTADA` o `SIN_OFERTAS` |
| offers | array | sí | Ofertas calculadas; lista vacía antes del análisis o si no hay entidades aptas |
| clicks | array | sí | Registro de cada visita a una entidad ofrecida; admite clics repetidos |
| createdAt | timestamp | sí | Fecha de creación de la solicitud |

Cada elemento de `offers` es un mapa con `lenderId` (string → lenders), `totalNew` (number, euros) y `totalReturning` (number, euros). Se ordena por menor `totalNew`, seguido de menor tiempo de respuesta y nombre al calcular las ofertas. Cada elemento de `clicks` es un mapa con `lenderId` (string → lenders, presente en `offers`) y `clickedAt` (timestamp). El backend registra el clic antes de construir la dirección de destino con los parámetros de seguimiento.

Índices compuestos: ninguno definido en este paso.
