# Colecciones compartidas

## lenders

Entidades disponibles para el inicio, el comparador, las solicitudes de ofertas y las páginas de tipos de préstamo. Id del documento: código fijo (`L-0001`, `L-0002`…). La URL de afiliado es un dato interno: el backend no la incluye en listados ni en ofertas previas al clic.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| name | string | sí | Nombre visible de la entidad |
| acronym | string | sí | Siglas de la entidad |
| minAmount | number | sí | Importe mínimo en euros |
| maxAmount | number | sí | Importe máximo en euros |
| minTermDays | number | sí | Plazo mínimo en días |
| maxTermDays | number | sí | Plazo máximo en días |
| minAge | number | sí | Edad mínima aceptada |
| maxAge | number | sí | Edad máxima aceptada |
| firstLoanFree | boolean | sí | Ofrece el primer préstamo sin intereses según sus condiciones |
| acceptsAsnef | boolean | sí | Acepta solicitudes de personas en ASNEF |
| noPayslip | boolean | sí | Permite solicitar sin nómina |
| responseMinutes | number | sí | Tiempo estimado de respuesta en minutos |
| recommended | boolean | sí | Identifica una entidad destacada |
| affiliateUrl | string | sí | URL interna de seguimiento; no se expone antes del clic |
| active | boolean | sí | Indica si la entidad está disponible |
| createdAt | timestamp | sí | Fecha de alta del documento |

No se especifican consultas que requieran índices compuestos para esta colección.
