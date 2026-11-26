/**
 * Solicitudes de ofertas. Depende de V1: los lenderId de las ofertas y los clics
 * corresponden a documentos de la colección compartida lenders.
 * Los teléfonos y las direcciones IP son valores ficticios de ejemplo.
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const at = (value) => Timestamp.fromDate(new Date(value));

const loanRequests = [
  {
    id: "LR-0001",
    amount: 300.00,
    termDays: 30,
    name: "Cliente Ejemplo",
    birthDate: "1990-05-12T00:00:00Z",
    mobile: "600000000",
    email: "cliente.uno@example.com",
    employmentStatus: "CUENTA_AJENA",
    asnef: "NO",
    acceptsPrivacy: true,
    acceptsCommunications: false,
    privacyAcceptedAt: "2026-11-26T10:00:00Z",
    communicationsAcceptedAt: null,
    ipAddress: "192.0.2.10",
    userAgent: "CredaraSeed/1.0",
    idempotencyKey: "seed-request-0001",
    status: "OFERTADA",
    offers: [
      { lenderId: "L-0003", amount: 300.00, termDays: 30, totalNew: 300.00, totalReturning: 390.00, firstLoanFree: true, responseMinutes: 5, bestOffer: true },
      { lenderId: "L-0001", amount: 300.00, termDays: 30, totalNew: 300.00, totalReturning: 390.00, firstLoanFree: true, responseMinutes: 10, bestOffer: false },
      { lenderId: "L-0002", amount: 300.00, termDays: 30, totalNew: 390.00, totalReturning: 390.00, firstLoanFree: false, responseMinutes: 15, bestOffer: false }
    ],
    clicks: [
      { lenderId: "L-0003", clickedAt: "2026-11-26T10:03:00Z" }
    ]
  },
  {
    id: "LR-0002",
    amount: 500.00,
    termDays: 45,
    name: "Visita Ejemplo",
    birthDate: "1985-08-20T00:00:00Z",
    mobile: "700000000",
    email: "cliente.dos@example.com",
    employmentStatus: "AUTONOMO",
    asnef: "SI",
    acceptsPrivacy: true,
    acceptsCommunications: true,
    privacyAcceptedAt: "2026-11-26T11:00:00Z",
    communicationsAcceptedAt: "2026-11-26T11:00:00Z",
    ipAddress: "192.0.2.11",
    userAgent: "CredaraSeed/1.0",
    idempotencyKey: "seed-request-0002",
    status: "RECIBIDA",
    offers: [],
    clicks: []
  },
  {
    id: "LR-0003",
    amount: 300.00,
    termDays: 30,
    name: "Consulta Ejemplo",
    birthDate: "1940-02-10T00:00:00Z",
    mobile: "600000001",
    email: "cliente.tres@example.com",
    employmentStatus: "PENSIONISTA",
    asnef: "NO_SE",
    acceptsPrivacy: true,
    acceptsCommunications: false,
    privacyAcceptedAt: "2026-11-26T12:00:00Z",
    communicationsAcceptedAt: null,
    ipAddress: "192.0.2.12",
    userAgent: "CredaraSeed/1.0",
    idempotencyKey: "seed-request-0003",
    status: "SIN_OFERTAS",
    offers: [],
    clicks: []
  }
];

exports.seed = async (db) => {
  const batch = db.batch();
  for (const { id, birthDate, privacyAcceptedAt, communicationsAcceptedAt, clicks, ...data } of loanRequests) {
    batch.set(db.collection("loanRequests").doc(id), {
      ...data,
      birthDate: at(birthDate),
      privacyAcceptedAt: at(privacyAcceptedAt),
      communicationsAcceptedAt: communicationsAcceptedAt === null ? null : at(communicationsAcceptedAt),
      clicks: clicks.map(({ lenderId, clickedAt }) => ({ lenderId, clickedAt: at(clickedAt) })),
      createdAt: FieldValue.serverTimestamp()
    });
  }
  await batch.commit();
};
