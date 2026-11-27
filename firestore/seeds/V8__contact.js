/**
 * Módulo: contact. Colección contactMessages.
 * Mensajes ficticios recibidos mediante el formulario público.
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const contactMessages = [
  {
    id: "CM-0001",
    name: "Lucía Ejemplo",
    email: "lucia@example.com",
    phone: null,
    reason: "DUDA_COMPARADOR",
    message: "Quisiera saber cómo se comparan los costes de las distintas ofertas.",
    privacyAccepted: true,
    privacyAcceptedAt: "2026-11-20T10:15:00Z",
    ip: "192.0.2.10",
    status: "NUEVO",
  },
  {
    id: "CM-0002",
    name: "Marcos Ejemplo",
    email: "marcos@example.com",
    phone: "+34900000001",
    reason: "DATOS_PERSONALES",
    message: "Quiero consultar cómo puedo ejercer mis derechos sobre los datos de una solicitud.",
    privacyAccepted: true,
    privacyAcceptedAt: "2026-11-21T12:30:00Z",
    ip: "192.0.2.11",
    status: "NUEVO",
  },
  {
    id: "CM-0003",
    name: "Elena Ejemplo",
    email: "elena@example.com",
    phone: null,
    reason: "ENTIDAD",
    message: "Represento a una entidad y quisiera conocer las condiciones para colaborar con Credara.",
    privacyAccepted: true,
    privacyAcceptedAt: "2026-11-22T09:45:00Z",
    ip: "192.0.2.12",
    status: "NUEVO",
  },
];

exports.seed = async (db) => {
  const batch = db.batch();
  for (const { id, privacyAcceptedAt, ...data } of contactMessages) {
    batch.set(db.collection("contactMessages").doc(id), {
      ...data,
      privacyAcceptedAt: Timestamp.fromDate(new Date(privacyAcceptedAt)),
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
};
