# Módulo: contact

## mensajesContacto

Mensajes recibidos desde el formulario público. Id del documento: código fijo (`CM-0001`, `CM-0002`…). El campo oculto antispam `web` no se guarda.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| name | string | sí | Nombre de quien escribe, de 2 a 60 caracteres |
| email | string | sí | Correo de respuesta |
| phone | string \| null | no | Teléfono opcional, de 9 a 15 dígitos con `+` inicial opcional |
| reason | string | sí | `DUDA_COMPARADOR`, `DATOS_PERSONALES`, `ENTIDAD` u `OTRO` |
| message | string | sí | Mensaje de 20 a 1.000 caracteres |
| acceptsPrivacy | boolean | sí | Aceptación de la privacidad; debe ser `true` |
| privacyAcceptedAt | timestamp | sí | Fecha y hora de aceptación de la privacidad |
| ipAddress | string | sí | IP utilizada para controlar el límite de envíos |
| status | string | sí | Estado inicial `NUEVO` |
| createdAt | timestamp | sí | Fecha y hora de recepción del mensaje |

No se especifican consultas que requieran índices compuestos para esta colección.
