/**
 * Módulo contact: mensajes recibidos mediante el formulario público.
 * Los datos personales y las direcciones IP son ficticios.
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const at = (value) => Timestamp.fromDate(new Date(value));

const contactMessages = [
  {
    id: "CM-0001",
    name: "Alex Ejemplo",
    email: "alex@example.com",
    phone: null,
    reason: "DUDA_COMPARADOR",
    message: "Quisiera saber cómo se comparan las condiciones de las entidades antes de solicitar una oferta.",
    acceptsPrivacy: true,
    privacyAcceptedAt: "2026-11-20T10:15:00Z",
    ipAddress: "192.0.2.10",
    status: "NUEVO"
  },
  {
    id: "CM-0002",
    name: "Sam Ejemplo",
    email: "sam@example.com",
    phone: null,
    reason: "DATOS_PERSONALES",
    message: "Quisiera conocer el procedimiento para ejercer mis derechos sobre los datos enviados mediante el formulario.",
    acceptsPrivacy: true,
    privacyAcceptedAt: "2026-11-21T12:30:00Z",
    ipAddress: "192.0.2.11",
    status: "NUEVO"
  },
  {
    id: "CM-0003",
    name: "Taylor Ejemplo",
    email: "taylor@example.com",
    phone: null,
    reason: "ENTIDAD",
    message: "Tengo una consulta sobre las condiciones publicadas de una entidad incluida en el comparador.",
    acceptsPrivacy: true,
    privacyAcceptedAt: "2026-11-22T09:45:00Z",
    ipAddress: "192.0.2.12",
    status: "NUEVO"
  }
];

exports.seed = async (db) => {
  const batch = db.batch();
  for (const { id, privacyAcceptedAt, ...data } of contactMessages) {
    batch.set(db.collection("mensajesContacto").doc(id), {
      ...data,
      privacyAcceptedAt: at(privacyAcceptedAt),
      createdAt: FieldValue.serverTimestamp()
    });
  }
  await batch.commit();
};
