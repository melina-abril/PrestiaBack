/**
 * Módulo: loan-applications. Colección applications.
 * Depende de V1 (lenders): los identificadores de las ofertas apuntan a entidades existentes.
 * Los datos personales y las direcciones IP son ficticios.
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const at = (value) => Timestamp.fromDate(new Date(value));

const applications = [
  {
    id: "APP-0001",
    amount: 300,
    termDays: 30,
    name: "Persona Ejemplo Uno",
    birthDate: "1994-05-12T00:00:00Z",
    mobile: "600000000",
    email: "persona.uno@example.com",
    employmentStatus: "CUENTA_AJENA",
    asnefStatus: "NO",
    privacyAccepted: true,
    privacyAcceptedAt: "2026-11-20T10:00:00Z",
    marketingAccepted: false,
    marketingAcceptedAt: null,
    ipAddress: "192.0.2.10",
    userAgent: "CredaraSeed/1.0",
    idempotencyKey: "seed-app-0001",
    status: "OFERTADA",
    offers: [
      { lenderId: "L-0001", totalNew: 300, totalReturning: 390 },
      { lenderId: "L-0002", totalNew: 390, totalReturning: 390 },
    ],
    clicks: [
      { lenderId: "L-0001", clickedAt: "2026-11-20T10:03:00Z" },
    ],
  },
  {
    id: "APP-0002",
    amount: 2000,
    termDays: 90,
    name: "Persona Ejemplo Dos",
    birthDate: "2000-02-20T00:00:00Z",
    mobile: "700000000",
    email: "persona.dos@example.com",
    employmentStatus: "OTROS_INGRESOS",
    asnefStatus: "SI",
    privacyAccepted: true,
    privacyAcceptedAt: "2026-11-21T09:15:00Z",
    marketingAccepted: true,
    marketingAcceptedAt: "2026-11-21T09:15:00Z",
    ipAddress: "192.0.2.11",
    userAgent: "CredaraSeed/1.0",
    idempotencyKey: "seed-app-0002",
    status: "SIN_OFERTAS",
    offers: [],
    clicks: [],
  },
  {
    id: "APP-0003",
    amount: 500,
    termDays: 45,
    name: "Persona Ejemplo Tres",
    birthDate: "1988-08-03T00:00:00Z",
    mobile: "600000000",
    email: "persona.tres@example.com",
    employmentStatus: "AUTONOMO",
    asnefStatus: "NO_SE",
    privacyAccepted: true,
    privacyAcceptedAt: "2026-11-22T16:30:00Z",
    marketingAccepted: false,
    marketingAcceptedAt: null,
    ipAddress: "192.0.2.12",
    userAgent: "CredaraSeed/1.0",
    idempotencyKey: "seed-app-0003",
    status: "RECIBIDA",
    offers: [],
    clicks: [],
  },
];

exports.seed = async (db) => {
  const batch = db.batch();
  for (const { id, birthDate, privacyAcceptedAt, marketingAcceptedAt, clicks, ...data } of applications) {
    batch.set(db.collection("applications").doc(id), {
      ...data,
      birthDate: at(birthDate),
      privacyAcceptedAt: at(privacyAcceptedAt),
      marketingAcceptedAt: marketingAcceptedAt === null ? null : at(marketingAcceptedAt),
      clicks: clicks.map(({ lenderId, clickedAt }) => ({ lenderId, clickedAt: at(clickedAt) })),
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
};
