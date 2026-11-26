/**
 * Módulo: solicitudes de préstamo y ofertas.
 * Colecciones lenders y loanApplications. Los datos personales de las solicitudes
 * son marcadores ficticios de prueba, no documentos, teléfonos ni cuentas reales.
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const at = (value) => Timestamp.fromDate(new Date(value));

const lenders = [
  { id: "L-0001", name: "Entidad Ejemplo Uno", initials: "EEU", minAmount: 50, maxAmount: 2000, minTermDays: 7, maxTermDays: 90, minMonthlyIncome: 900, dailyRate: 0.012, firstLoanFree: true, responseTime: "10 min", websiteUrl: "https://example.com/entidad-uno", active: true },
  { id: "L-0002", name: "Entidad Ejemplo Dos", initials: "EED", minAmount: 100, maxAmount: 1500, minTermDays: 7, maxTermDays: 60, minMonthlyIncome: 1200, dailyRate: 0.01, firstLoanFree: false, responseTime: "1 h", websiteUrl: "https://example.com/entidad-dos", active: true },
  { id: "L-0003", name: "Entidad Ejemplo Tres", initials: "EET", minAmount: 50, maxAmount: 1000, minTermDays: 7, maxTermDays: 45, minMonthlyIncome: 700, dailyRate: 0.008, firstLoanFree: false, responseTime: "30 min", websiteUrl: "https://example.com/entidad-tres", active: true },
  { id: "L-0004", name: "Entidad Ejemplo Inactiva", initials: "EEI", minAmount: 50, maxAmount: 2000, minTermDays: 7, maxTermDays: 90, minMonthlyIncome: 500, dailyRate: 0.007, firstLoanFree: false, responseTime: "1 h", websiteUrl: "https://example.com/entidad-inactiva", active: false },
];

const loanApplications = [
  {
    id: "LA-0001", amount: 500, termDays: 30, purpose: "UNEXPECTED_EXPENSE",
    firstName: "Persona", lastName: "Ejemplo Uno", identityDocument: "TEST-DNI-001",
    birthDate: "1990-05-12T00:00:00Z", email: "solicitud-uno@example.com",
    phonePrefix: "+34", mobile: "TEST-MOBILE-001", employmentStatus: "EMPLOYED",
    monthlyIncome: 1800, monthlyExpenses: 650, iban: "TEST-IBAN-001",
    privacyTermsAccepted: true, privacyTermsAcceptedAt: "2026-11-26T10:00:00Z",
    creditCheckAccepted: true, creditCheckAcceptedAt: "2026-11-26T10:00:00Z",
    marketingAccepted: false, marketingAcceptedAt: null,
    idempotencyKey: "example-submission-0001", sourceIp: "192.0.2.10", status: "OFERTADA",
    offers: [
      { lenderId: "L-0001", totalRepayment: 500 },
      { lenderId: "L-0003", totalRepayment: 620 },
      { lenderId: "L-0002", totalRepayment: 650 },
    ],
  },
  {
    id: "LA-0002", amount: 2000, termDays: 90, purpose: "TRAVEL",
    firstName: "Persona", lastName: "Ejemplo Dos", identityDocument: "TEST-DNI-002",
    birthDate: "1985-08-20T00:00:00Z", email: "solicitud-dos@example.com",
    phonePrefix: "+34", mobile: "TEST-MOBILE-002", employmentStatus: "RETIRED",
    monthlyIncome: 500, monthlyExpenses: null, iban: "TEST-IBAN-002",
    privacyTermsAccepted: true, privacyTermsAcceptedAt: "2026-11-26T10:15:00Z",
    creditCheckAccepted: true, creditCheckAcceptedAt: "2026-11-26T10:15:00Z",
    marketingAccepted: true, marketingAcceptedAt: "2026-11-26T10:15:00Z",
    idempotencyKey: "example-submission-0002", sourceIp: "192.0.2.11", status: "SIN_OFERTAS",
    offers: [],
  },
  {
    id: "LA-0003", amount: 300, termDays: 20, purpose: "PURCHASES",
    firstName: "Persona", lastName: "Ejemplo Tres", identityDocument: "TEST-DNI-003",
    birthDate: "1995-03-07T00:00:00Z", email: "solicitud-tres@example.com",
    phonePrefix: "+54", mobile: "TEST-MOBILE-003", employmentStatus: "SELF_EMPLOYED",
    monthlyIncome: 1100, monthlyExpenses: 200, iban: "TEST-IBAN-003",
    privacyTermsAccepted: true, privacyTermsAcceptedAt: "2026-11-26T10:30:00Z",
    creditCheckAccepted: true, creditCheckAcceptedAt: "2026-11-26T10:30:00Z",
    marketingAccepted: false, marketingAcceptedAt: null,
    idempotencyKey: "example-submission-0003", sourceIp: "192.0.2.12", status: "RECIBIDA",
    offers: [],
  },
];

exports.seed = async (db) => {
  const batch = db.batch();
  for (const { id, ...data } of lenders) {
    batch.set(db.collection("lenders").doc(id), {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  for (const {
    id, birthDate, privacyTermsAcceptedAt, creditCheckAcceptedAt,
    marketingAcceptedAt, ...data
  } of loanApplications) {
    batch.set(db.collection("loanApplications").doc(id), {
      ...data,
      birthDate: at(birthDate),
      privacyTermsAcceptedAt: at(privacyTermsAcceptedAt),
      creditCheckAcceptedAt: at(creditCheckAcceptedAt),
      marketingAcceptedAt: marketingAcceptedAt === null ? null : at(marketingAcceptedAt),
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
};
