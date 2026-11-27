import { db } from '../../config/database.js';

/** Campos de los documentos cargados en loanTypes por la capa database. */
export interface LoanTypeDocument {
  slug: string;
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
}

export type LoanType = LoanTypeDocument & { id: string };

/** Campos públicos y de selección de la colección compartida lenders. affiliateUrl no se lee. */
export interface LoanTypeLenderDocument {
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
  active: boolean;
}

export type LoanTypeLender = LoanTypeLenderDocument & { id: string };

export const LOAN_TYPES_COLLECTION = { collectionName: 'loanTypes' } as const;
const collection = () => db.collection(LOAN_TYPES_COLLECTION.collectionName);

export const loanTypesRepository = {
  async findActive(): Promise<LoanType[]> {
    const snapshot = await collection().orderBy('order').get();
    return snapshot.docs
      .map((doc): LoanType => ({ ...(doc.data() as LoanTypeDocument), id: doc.id }))
      .filter((type) => type.active);
  },

  async findActiveBySlug(slug: string): Promise<LoanType | undefined> {
    const snapshot = await collection().where('slug', '==', slug).limit(1).get();
    const doc = snapshot.docs[0];
    if (!doc) return undefined;
    const type: LoanType = { ...(doc.data() as LoanTypeDocument), id: doc.id };
    return type.active ? type : undefined;
  },

  /** Lectura de la colección compartida lenders, sin acceder a su URL de afiliación. */
  async findActiveLenders(): Promise<LoanTypeLender[]> {
    const snapshot = await db.collection('lenders').where('active', '==', true).get();
    return snapshot.docs.map((doc): LoanTypeLender => {
      const data = doc.data() as LoanTypeLenderDocument;
      return {
        id: doc.id,
        name: data.name,
        initials: data.initials,
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
        minTermDays: data.minTermDays,
        maxTermDays: data.maxTermDays,
        minAge: data.minAge,
        maxAge: data.maxAge,
        firstLoanFree: data.firstLoanFree,
        acceptsAsnef: data.acceptsAsnef,
        noPayslip: data.noPayslip,
        responseMinutes: data.responseMinutes,
        recommended: data.recommended,
        active: data.active,
      };
    });
  },
};
