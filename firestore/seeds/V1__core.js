/**
 * Colección compartida lenders: entidades utilizadas por el inicio, el comparador,
 * las solicitudes de ofertas y las páginas de tipos de préstamo.
 */
const { FieldValue } = require("firebase-admin/firestore");

const lenders = [
  {
    id: "L-0001",
    name: "Crédito Claro",
    acronym: "CC",
    minAmount: 50,
    maxAmount: 1000,
    minTermDays: 7,
    maxTermDays: 60,
    minAge: 18,
    maxAge: 75,
    firstLoanFree: true,
    acceptsAsnef: false,
    noPayslip: true,
    responseMinutes: 10,
    recommended: true,
    affiliateUrl: "https://credito-claro.example.com/solicitud",
    active: true
  },
  {
    id: "L-0002",
    name: "Impulso Online",
    acronym: "IO",
    minAmount: 100,
    maxAmount: 2000,
    minTermDays: 15,
    maxTermDays: 90,
    minAge: 21,
    maxAge: 80,
    firstLoanFree: false,
    acceptsAsnef: true,
    noPayslip: true,
    responseMinutes: 15,
    recommended: true,
    affiliateUrl: "https://impulso-online.example.com/solicitud",
    active: true
  },
  {
    id: "L-0003",
    name: "Préstamo Ágil",
    acronym: "PA",
    minAmount: 50,
    maxAmount: 1500,
    minTermDays: 7,
    maxTermDays: 90,
    minAge: 18,
    maxAge: 70,
    firstLoanFree: true,
    acceptsAsnef: true,
    noPayslip: false,
    responseMinutes: 5,
    recommended: true,
    affiliateUrl: "https://prestamo-agil.example.com/solicitud",
    active: true
  }
];

exports.seed = async (db) => {
  const batch = db.batch();
  for (const { id, ...data } of lenders) {
    batch.set(db.collection("lenders").doc(id), {
      ...data,
      createdAt: FieldValue.serverTimestamp()
    });
  }
  await batch.commit();
};
