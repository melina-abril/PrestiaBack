# Módulo: solicitudes de préstamo y ofertas

## lenders

Catálogo de entidades para calcular ofertas. Id del documento: `L-0001`, `L-0002`… Las direcciones `example.com` son únicamente de ejemplo; no corresponden a entidades reales.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| name | string | sí | Nombre visible de la entidad |
| initials | string | sí | Siglas visibles |
| minAmount | number | sí | Monto mínimo en euros |
| maxAmount | number | sí | Monto máximo en euros |
| minTermDays | number | sí | Plazo mínimo en días |
| maxTermDays | number | sí | Plazo máximo en días |
| minMonthlyIncome | number | sí | Ingresos netos mensuales mínimos en euros |
| dailyRate | number | sí | Tasa diaria como fracción; `0.012` equivale al 1,2 % |
| firstLoanFree | boolean | sí | Si ofrece hasta 30 días sin intereses para un primer préstamo elegible |
| responseTime | string | sí | Tiempo de respuesta mostrado al visitante |
| websiteUrl | string | sí | Dirección a la que lleva la acción Solicitar |
| active | boolean | sí | Solo las entidades activas pueden ofrecer préstamos |
| createdAt | timestamp | sí | Alta del documento |

## loanApplications

Leads confirmados y resultado del cálculo de ofertas. Id del documento: `LA-0001`, `LA-0002`… Los documentos de ejemplo contienen marcadores `TEST-*` en lugar de documentos de identidad, móviles o cuentas reales; esos marcadores no cumplen la validación de nuevas solicitudes y no deben usarse como datos de producción. Las direcciones IP del ejemplo pertenecen al rango reservado para documentación.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| amount | number | sí | Monto solicitado en euros: de 50 a 2.000, en pasos de 50 |
| termDays | number | sí | Plazo solicitado: de 7 a 90 días |
| purpose | string | sí | `UNEXPECTED_EXPENSE`, `PURCHASES`, `TRAVEL` u `OTHER` |
| firstName | string | sí | Nombre del titular |
| lastName | string | sí | Apellidos del titular |
| identityDocument | string | sí | DNI o NIE del titular, normalizado en mayúsculas |
| birthDate | timestamp | sí | Fecha de nacimiento del titular |
| email | string | sí | Correo del titular |
| phonePrefix | string | sí | Prefijo `+34` o `+54` |
| mobile | string | sí | Número móvil sin prefijo |
| employmentStatus | string | sí | `EMPLOYED`, `SELF_EMPLOYED`, `RETIRED` o `UNEMPLOYED` |
| monthlyIncome | number | sí | Ingresos netos mensuales en euros |
| monthlyExpenses | number \| null | no | Gastos fijos mensuales en euros |
| iban | string | sí | IBAN español normalizado, sin espacios |
| privacyTermsAccepted | boolean | sí | Aceptación obligatoria de privacidad y términos |
| privacyTermsAcceptedAt | timestamp | sí | Fecha de aceptación de privacidad y términos |
| creditCheckAccepted | boolean | sí | Autorización obligatoria de consulta crediticia |
| creditCheckAcceptedAt | timestamp | sí | Fecha de autorización de consulta crediticia |
| marketingAccepted | boolean | sí | Consentimiento opcional de comunicaciones comerciales |
| marketingAcceptedAt | timestamp \| null | no | Fecha de aceptación comercial, si corresponde |
| idempotencyKey | string | sí | Clave única del envío para impedir solicitudes duplicadas |
| sourceIp | string | sí | Dirección IP usada para limitar a cinco solicitudes por hora |
| status | string | sí | `RECIBIDA`, `OFERTADA` o `SIN_OFERTAS` |
| offers | array | sí | Ofertas calculadas y ordenadas; vacío antes del cálculo o si no hay ofertas |
| createdAt | timestamp | sí | Fecha de creación del lead |

Cada elemento de `offers` es un mapa con `lenderId` (`string → lenders`, id de una entidad existente) y `totalRepayment` (`number`, total a devolver en euros). Las solicitudes con estado `OFERTADA` guardan las entidades ofrecidas y sus totales; `SIN_OFERTAS` guarda un array vacío.

Índice compuesto necesario: `sourceIp` asc + `createdAt` desc, para contar las solicitudes recientes de una IP. La búsqueda por `idempotencyKey` utiliza el índice automático de un solo campo.
