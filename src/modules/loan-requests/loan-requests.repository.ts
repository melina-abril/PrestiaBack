import type { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { nowTimestamp, withId } from '../../shared/db/db-utils.js';
import type { AsnefAnswer, EmploymentStatus, LoanRequestStatus } from './loan-requests.schemas.js';

export interface StoredOffer {
  lenderId: string;
  amount: number;
  termDays: number;
  totalNew: number;
  totalReturning: number;
  firstLoanFree: boolean;
  responseMinutes: number;
  bestOffer: boolean;
}

export interface StoredClick {
  lenderId: string;
  clickedAt: Timestamp;
}

/** Campos de loanRequests, incluidos los documentos cargados por la capa database. */
export interface LoanRequestDocument {
  amount: number;
  termDays: number;
  name: string;
  birthDate: Timestamp;
  mobile: string;
  email: string;
  employmentStatus: EmploymentStatus;
  asnef: AsnefAnswer;
  acceptsPrivacy: boolean;
  acceptsCommunications: boolean;
  privacyAcceptedAt: Timestamp;
  communicationsAcceptedAt: Timestamp | null;
  ipAddress: string;
  userAgent: string;
  idempotencyKey: string;
  status: LoanRequestStatus;
  offers: StoredOffer[];
  clicks: StoredClick[];
  createdAt: Timestamp;
}

export type LoanRequest = LoanRequestDocument & { id: string };
export type NewLoanRequest = Omit<LoanRequestDocument, 'createdAt'>;

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

export const LOAN_REQUESTS_COLLECTION = { collectionName: 'loanRequests' } as const;
/** Colección compartida, creada por la capa database; este módulo no la crea ni la carga. */
export const LENDERS_COLLECTION = { collectionName: 'lenders' } as const;

const requests = () => db.collection(LOAN_REQUESTS_COLLECTION.collectionName);
const lenders = () => db.collection(LENDERS_COLLECTION.collectionName);

export const loanRequestsRepository = {
  /** La clave determina el id: dos envíos concurrentes de la misma clave compiten por el mismo documento. */
  async insertOnce(id: string, document: NewLoanRequest, earliestAllowed: Timestamp): Promise<{ request: LoanRequest; limited: boolean }> {
    return db.runTransaction(async (trx) => {
      const ref = requests().doc(id);
      const existing = await trx.get(ref);
      if (existing.exists) {
        return { request: { ...(existing.data() as LoanRequestDocument), id }, limited: false };
      }
      // Solo se filtra por IP en Firestore; la ventana se comprueba aquí para no exigir un índice compuesto.
      const sameIp = await trx.get(requests().where('ipAddress', '==', document.ipAddress));
      const recentCount = sameIp.docs.filter((entry) => {
        const createdAt = (entry.data() as LoanRequestDocument).createdAt;
        return createdAt.toMillis() >= earliestAllowed.toMillis();
      }).length;
      if (recentCount >= 5) return { request: { ...document, createdAt: nowTimestamp(), id }, limited: true };
      const createdAt = nowTimestamp();
      const stored: LoanRequestDocument = { ...document, createdAt };
      trx.create(ref, stored);
      return { request: { ...stored, id }, limited: false };
    });
  },

  async findById(id: string): Promise<LoanRequest | undefined> {
    return withId<LoanRequestDocument>(await requests().doc(id).get());
  },

  async findActiveLenders(): Promise<Lender[]> {
    const snapshot = await lenders().where('active', '==', true).get();
    return snapshot.docs.map((doc) => ({ ...(doc.data() as LenderDocument), id: doc.id }));
  },

  async saveOffers(id: string, offers: StoredOffer[]): Promise<boolean> {
    return db.runTransaction(async (trx) => {
      const ref = requests().doc(id);
      const existing = await trx.get(ref);
      if (!existing.exists) return false;
      const status: LoanRequestStatus = offers.length ? 'OFERTADA' : 'SIN_OFERTAS';
      trx.update(ref, { offers, status });
      return true;
    });
  },

  /** Lee la entidad y registra el clic en una única transacción. Nunca devuelve la URL en el listado de ofertas. */
  async recordClick(requestId: string, lenderId: string): Promise<string | undefined> {
    return db.runTransaction(async (trx) => {
      const requestRef = requests().doc(requestId);
      const lenderRef = lenders().doc(lenderId);
      const requestSnapshot = await trx.get(requestRef);
      if (!requestSnapshot.exists) return undefined;
      const lenderSnapshot = await trx.get(lenderRef);
      const request = requestSnapshot.data() as LoanRequestDocument;
      if (!request.offers.some((offer) => offer.lenderId === lenderId) || !lenderSnapshot.exists) return undefined;
      const lender = lenderSnapshot.data() as LenderDocument;
      if (!lender.active) return undefined;
      const clicks: StoredClick[] = [...request.clicks, { lenderId, clickedAt: nowTimestamp() }];
      trx.update(requestRef, { clicks });
      return lender.affiliateUrl;
    });
  },
};
