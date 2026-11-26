import type { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { withId } from '../../shared/db/db-utils.js';

/** Campos de loanTypes tal como los carga la base; el slug es el id del documento. */
export interface LoanTypeDocument {
  title: string;
  icon: string;
  summary: string;
  subtitle: string;
  tags: string[];
  criterion: string;
  requirements: string[];
  advantages: string[];
  disadvantages: string[];
  questions: { question: string; answer: string }[];
  related: string[];
  metaTitle: string;
  metaDescription: string;
  order: number;
  active: boolean;
  createdAt: Timestamp;
}

export type LoanType = LoanTypeDocument & { id: string };
export const LOAN_TYPES_COLLECTION = { collectionName: 'loanTypes' } as const;

/** Colección compartida: la usan el inicio, el comparador, las solicitudes y los tipos. */
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

const loanTypes = () => db.collection(LOAN_TYPES_COLLECTION.collectionName);
const lenders = () => db.collection(LENDERS_COLLECTION.collectionName);

export const loanTypesRepository = {
  async findActive(): Promise<LoanType[]> {
    const snapshot = await loanTypes().where('active', '==', true).get();
    return snapshot.docs
      .map((doc) => ({ ...doc.data() as LoanTypeDocument, id: doc.id }))
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  },

  async findActiveBySlug(slug: string): Promise<LoanType | undefined> {
    const result = withId<LoanTypeDocument>(await loanTypes().doc(slug).get());
    return result?.active ? result : undefined;
  },

  async findActiveLenders(): Promise<Lender[]> {
    const snapshot = await lenders().where('active', '==', true).get();
    return snapshot.docs.map((doc) => ({ ...doc.data() as LenderDocument, id: doc.id }));
  },
};
