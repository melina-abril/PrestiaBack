import type { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { withId } from '../../shared/db/db-utils.js';
import { offsetOf } from '../../shared/http/page.js';
import type { LenderListQuery } from './lenders.schemas.js';

/** Campos de la colección compartida lenders, según firestore/seeds/V1__core.js. */
export interface LenderDocument {
  name: string;
  initials: string;
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
const collection = () => db.collection(LENDERS_COLLECTION.collectionName);

const byName = (left: Lender, right: Lender): number => left.name.localeCompare(right.name, 'es');
const byRecommended = (left: Lender, right: Lender): number => Number(right.recommended) - Number(left.recommended);

/** Firestore no puede ordenar por un total calculado ni paginar antes de aplicar rangos sobre varios campos. */
export const lendersRepository = {
  async findPage(
    query: LenderListQuery,
    totalNew: (lender: Lender) => number,
  ): Promise<{ items: Lender[]; total: number }> {
    const snapshot = await collection().where('active', '==', true).get();
    const filtered = snapshot.docs
      .map((doc) => withId<LenderDocument>(doc))
      .filter((lender): lender is Lender => lender !== undefined)
      .filter((lender) =>
        (query.amount === undefined || (lender.minAmount <= query.amount && query.amount <= lender.maxAmount)) &&
        (query.termDays === undefined || (lender.minTermDays <= query.termDays && query.termDays <= lender.maxTermDays)) &&
        (query.age === undefined || (lender.minAge <= query.age && query.age <= lender.maxAge)) &&
        (!query.firstLoanFree || lender.firstLoanFree) &&
        (!query.acceptsAsnef || lender.acceptsAsnef) &&
        (!query.noPayslip || lender.noPayslip),
      );

    filtered.sort((left, right) => {
      switch (query.order) {
        case 'total':
          return totalNew(left) - totalNew(right) || byName(left, right);
        case 'maxAmount':
          return right.maxAmount - left.maxAmount || byName(left, right);
        case 'response':
          return left.responseMinutes - right.responseMinutes || byName(left, right);
        case 'recommended':
          return byRecommended(left, right) || byName(left, right);
      }
    });

    return {
      items: filtered.slice(offsetOf(query), offsetOf(query) + query.size),
      total: filtered.length,
    };
  },

  async findFeatured(): Promise<Lender[]> {
    const snapshot = await collection().where('active', '==', true).get();
    return snapshot.docs
      .map((doc) => withId<LenderDocument>(doc))
      .filter((lender): lender is Lender => lender !== undefined)
      .sort((left, right) => byRecommended(left, right) || left.responseMinutes - right.responseMinutes || byName(left, right))
      .slice(0, 3);
  },
};
