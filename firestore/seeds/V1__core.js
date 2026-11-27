const { FieldValue } = require("firebase-admin/firestore");

const lenders = [
  {
    id: "L-0001",
    name: "Crédito Alba",
    initials: "CA",
    minAmount: 50,
    maxAmount: 2000,
    minTermDays: 7,
    maxTermDays: 90,
    minAge: 18,
    maxAge: 75,
    firstLoanFree: true,
    acceptsAsnef: false,
    noPayslip: true,
    responseMinutes: 10,
    recommended: true,
    affiliateUrl: "https://example.com/partners/credito-alba",
    active: true,
  },
  {
    id: "L-0002",
    name: "Préstamo Claro",
    initials: "PC",
    minAmount: 100,
    maxAmount: 1500,
    minTermDays: 15,
    maxTermDays: 60,
    minAge: 21,
    maxAge: 70,
    firstLoanFree: false,
    acceptsAsnef: true,
    noPayslip: true,
    responseMinutes: 15,
    recommended: true,
    affiliateUrl: "https://example.com/partners/prestamo-claro",
    active: true,
  },
  {
    id: "L-0003",
    name: "Financia Norte",
    initials: "FN",
    minAmount: 300,
    maxAmount: 2000,
    minTermDays: 30,
    maxTermDays: 90,
    minAge: 25,
    maxAge: 80,
    firstLoanFree: false,
    acceptsAsnef: false,
    noPayslip: false,
    responseMinutes: 20,
    recommended: true,
    affiliateUrl: "https://example.com/partners/financia-norte",
    active: true,
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
  await batch.commit();
};
