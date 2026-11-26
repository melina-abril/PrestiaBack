import type { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { offsetOf } from '../../shared/http/page.js';
import type { LenderListQuery } from './lenders.schemas.js';

/** Campos de los documentos cargados en firestore/seeds/V1__core.js. */
export interface LenderDocument {
  name: string;
  acronym: string;
  minAmount: number;
  maxAmount: number;
  minTermDays: number;
  maxTermDays: number;
  minAge: number;
  maxAge: number;
  firstLoanFree: boolean;
  acceptsAsnef: boolean;
  noPayslip: boolean;
  responseMinutes: number;
  recommended: boolean;
  affiliateUrl: string;
  active: boolean;
  createdAt: Timestamp;
}

export type Lender = LenderDocument & { id: string };
export const LENDERS_COLLECTION = { collectionName: 'lenders' } as const;

const byName = (left: Lender, right: Lender): number => left.name.localeCompare(right.name, 'es');
const byRecommended = (left: Lender, right: Lender): number =>
  Number(right.recommended) - Number(left.recommended) || byName(left, right);

/** Los intereses se redondean al euro más cercano, con 0,50 hacia arriba. */
export const totalFor = (amount: number, days: number, firstLoanFree: boolean): number =>
  amount + Math.floor(amount * 0.01 * Math.max(0, days - (firstLoanFree ? 30 : 0)) + 0.5 + Number.EPSILON);

export const lendersRepository = {
  async findPage(query: LenderListQuery): Promise<{ items: Lender[]; total: number }> {
    // La base no declara índices compuestos. Consultamos únicamente documentos activos y
    // aplicamos los filtros combinables, el orden y la página sobre ese conjunto.
    const snapshot = await db.collection(LENDERS_COLLECTION.collectionName).where('active', '==', true).get();
    const active: Lender[] = snapshot.docs.map((doc) => ({ ...(doc.data() as LenderDocument), id: doc.id }));

    if (query.featured === true) {
      const featured = active.sort((left, right) =>
        Number(right.recommended) - Number(left.recommended) ||
        left.responseMinutes - right.responseMinutes || byName(left, right));
      return { items: featured.slice(0, 3), total: Math.min(featured.length, 3) };
    }

    const filtered = active.filter((lender) =>
      (query.amount === undefined || (lender.minAmount <= query.amount && query.amount <= lender.maxAmount)) &&
      (query.termDays === undefined || (lender.minTermDays <= query.termDays && query.termDays <= lender.maxTermDays)) &&
      (query.age === undefined || (lender.minAge <= query.age && query.age <= lender.maxAge)) &&
      (query.firstLoanFree !== true || lender.firstLoanFree) &&
      (query.asnef !== true || lender.acceptsAsnef) &&
      (query.noPayslip !== true || lender.noPayslip));

    filtered.sort((left, right) => {
      switch (query.sort) {
        case 'total':
          if (query.amount !== undefined && query.termDays !== undefined) {
            return totalFor(query.amount, query.termDays, left.firstLoanFree) -
              totalFor(query.amount, query.termDays, right.firstLoanFree) || byName(left, right);
          }
          return byName(left, right);
        case 'maxAmount':
          return right.maxAmount - left.maxAmount || byName(left, right);
        case 'response':
          return left.responseMinutes - right.responseMinutes || byName(left, right);
        default:
          return byRecommended(left, right);
      }
    });

    return { items: filtered.slice(offsetOf(query), offsetOf(query) + query.size), total: filtered.length };
  },

  async findById(id: string): Promise<Lender | undefined> {
    const snapshot = await db.collection(LENDERS_COLLECTION.collectionName).doc(id).get();
    if (!snapshot.exists) return undefined;
    return { ...(snapshot.data() as LenderDocument), id: snapshot.id };
  },
};
