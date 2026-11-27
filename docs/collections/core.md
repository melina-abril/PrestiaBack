# Core: colecciones compartidas

## lenders

Entidades de préstamo compartidas por inicio, comparador, solicitudes y tipos de préstamo. Id del documento: código fijo (`L-0001`, `L-0002`…). Las direcciones de afiliación son privadas: el backend no las entrega en listados ni ofertas; solo las usa después de registrar el clic. Las direcciones del seed apuntan a `example.com` y deben sustituirse por las acordadas con cada entidad antes de operar.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| name | string | sí | Nombre visible de la entidad |
| initials | string | sí | Iniciales para su identificación visual |
| minAmount | number | sí | Importe mínimo admitido, en euros |
| maxAmount | number | sí | Importe máximo admitido, en euros |
| minTermDays | number | sí | Plazo mínimo, en días |
| maxTermDays | number | sí | Plazo máximo, en días |
| minAge | number | sí | Edad mínima admitida, en años |
| maxAge | number | sí | Edad máxima admitida, en años |
| firstLoanFree | boolean | sí | Si ofrece el primer préstamo sin intereses según sus condiciones |
| acceptsAsnef | boolean | sí | Si acepta solicitudes de personas en ASNEF |
| noPayslip | boolean | sí | Si permite solicitar sin nómina |
| responseMinutes | number | sí | Tiempo estimado de respuesta, en minutos |
| recommended | boolean | sí | Si la entidad aparece entre las recomendadas |
| affiliateUrl | string | sí | Dirección privada de afiliación, usada únicamente tras registrar un clic |
| active | boolean | sí | Si la entidad participa actualmente en el comparador |
| createdAt | timestamp | sí | Alta del documento |

Índices compuestos: ninguno definido en este paso.
