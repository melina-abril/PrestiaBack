import { Timestamp, type Query } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { nowTimestamp, withId } from '../../shared/db/db-utils.js';
import type { ApplicationStatus, AsnefStatus, EmploymentStatus } from './loan-applications.schemas.js';

export interface StoredOffer {
  lenderId: string;
  totalNew: number;
  totalReturning: number;
}

export interface StoredClick {
  lenderId: string;
  clickedAt: Timestamp;
}

/** Campos de applications, incluidos los consentimientos y registros de clic del esquema de Firestore. */
export interface ApplicationDocument {
  amount: number;
  termDays: number;
  name: string;
  birthDate: Timestamp;
  mobile: string;
  email: string;
  employmentStatus: EmploymentStatus;
  asnefStatus: AsnefStatus;
  privacyAccepted: boolean;
  privacyAcceptedAt: Timestamp;
  marketingAccepted: boolean;
  marketingAcceptedAt: Timestamp | null;
  ipAddress: string;
  userAgent: string;
  idempotencyKey: string;
  status: ApplicationStatus;
  offers: StoredOffer[];
  clicks: StoredClick[];
  createdAt: Timestamp;
}
export type Application = ApplicationDocument & { id: string };

/** La colección lenders es compartida y la crea el core de la base de datos. */
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

export const APPLICATIONS_COLLECTION = { collectionName: 'applications' } as const;
const applications = () => db.collection(APPLICATIONS_COLLECTION.collectionName);
const lenders = () => db.collection('lenders');

export const loanApplicationsRepository = {
  async findById(id: string): Promise<Application | undefined> {
    return withId<ApplicationDocument>(await applications().doc(id).get());
  },

  /** Se leen todas las solicitudes de la IP para no depender de un índice compuesto. */
  async createLimited(document: ApplicationDocument): Promise<{ id: string; limited: boolean }> {
    const result = await db.runTransaction(async (transaction): Promise<{ id: string; limited: boolean }> => {
      const existing = await transaction.get(applications().where('idempotencyKey', '==', document.idempotencyKey).limit(1));
      if (!existing.empty) return { id: existing.docs[0]!.id, limited: false };

      const byIp: Query = applications().where('ipAddress', '==', document.ipAddress);
      const recent = await transaction.get(byIp);
      const hourAgo = Date.now() - 60 * 60 * 1000;
      const count = recent.docs.filter((snapshot) => {
        const application = snapshot.data() as ApplicationDocument;
        return application.createdAt.toMillis() >= hourAgo;
      }).length;
      if (count >= 5) return { id: '', limited: true };

      const ref = applications().doc();
      transaction.create(ref, document);
      return { id: ref.id, limited: false };
    });
    return result;
  },

  async findActiveLenders(): Promise<Lender[]> {
    const snapshot = await lenders().where('active', '==', true).get();
    return snapshot.docs.map((doc) => ({ ...(doc.data() as LenderDocument), id: doc.id }));
  },

  async findLenderById(id: string): Promise<Lender | undefined> {
    return withId<LenderDocument>(await lenders().doc(id).get());
  },

  /** Si la escritura falla, el documento mantiene su estado anterior. */
  async saveOffers(id: string, offers: StoredOffer[]): Promise<void> {
    await applications().doc(id).update({ offers, status: offers.length > 0 ? 'OFERTADA' : 'SIN_OFERTAS' });
  },

  /** Comprueba y escribe en una sola transacción para no perder clics simultáneos. */
  async appendClick(id: string, lenderId: string): Promise<boolean> {
    return db.runTransaction(async (transaction): Promise<boolean> => {
      const ref = applications().doc(id);
      const snapshot = await transaction.get(ref);
      if (!snapshot.exists) return false;
      const application = snapshot.data() as ApplicationDocument;
      if (!application.offers.some((offer) => offer.lenderId === lenderId)) return false;
      transaction.update(ref, { clicks: [...application.clicks, { lenderId, clickedAt: nowTimestamp() }] });
      return true;
    });
  },

  newDocument(input: Omit<ApplicationDocument, 'createdAt'>): ApplicationDocument {
    return { ...input, createdAt: nowTimestamp() };
  },

  birthTimestamp(value: string): Timestamp {
    return Timestamp.fromDate(new Date(`${value}T00:00:00.000Z`));
  },
};
