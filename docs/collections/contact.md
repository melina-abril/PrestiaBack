# Módulo: contact

## contactMessages

Mensajes recibidos desde el formulario público. Id del documento: código fijo (`CM-0001`, `CM-0002`…). El backend valida los campos, limita los envíos por IP y descarta los formularios cuyo campo oculto `web` tenga contenido antes de guardar el mensaje. No se guarda el campo `web`.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| name | string | sí | Nombre de quien escribe, de 2 a 60 caracteres |
| email | string | sí | Correo electrónico de respuesta |
| phone | string \| null | no | Teléfono opcional; entre 9 y 15 dígitos, con `+` inicial opcional |
| reason | string | sí | `DUDA_COMPARADOR`, `DATOS_PERSONALES`, `ENTIDAD` u `OTRO` |
| message | string | sí | Mensaje, de 20 a 1.000 caracteres |
| privacyAccepted | boolean | sí | Consentimiento de privacidad; debe ser `true` |
| privacyAcceptedAt | timestamp | sí | Fecha y hora de aceptación de la privacidad |
| ip | string | sí | IP de origen para aplicar el límite de envíos |
| status | string | sí | Estado inicial: `NUEVO` |
| createdAt | timestamp | sí | Fecha y hora de recepción del mensaje |

Índices compuestos: ninguno definido en este módulo.
