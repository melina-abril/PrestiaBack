import { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { nowTimestamp, withId } from '../../shared/db/db-utils.js';
import type { ApplicationStatus, EmploymentStatus, LoanPurpose } from './loan-applications.schemas.js';

export interface LenderDocument {
  name: string;
  initials: string;
  minAmount: number;
  maxAmount: number;
  minTermDays: number;
  maxTermDays: number;
  minMonthlyIncome: number;
  dailyRate: number;
  firstLoanFree: boolean;
  responseTime: string;
  websiteUrl: string;
  active: boolean;
  createdAt: Timestamp;
}
export type Lender = LenderDocument & { id: string };

export interface StoredOffer {
  lenderId: string;
  totalRepayment: number;
}

export interface LoanApplicationDocument {
  amount: number;
  termDays: number;
  purpose: LoanPurpose;
  firstName: string;
  lastName: string;
  identityDocument: string;
  birthDate: Timestamp;
  email: string;
  phonePrefix: string;
  mobile: string;
  employmentStatus: EmploymentStatus;
  monthlyIncome: number;
  monthlyExpenses: number | null;
  iban: string;
  privacyTermsAccepted: boolean;
  privacyTermsAcceptedAt: Timestamp;
  creditCheckAccepted: boolean;
  creditCheckAcceptedAt: Timestamp;
  marketingAccepted: boolean;
  marketingAcceptedAt: Timestamp | null;
  idempotencyKey: string;
  sourceIp: string;
  status: ApplicationStatus;
  offers: StoredOffer[];
  createdAt: Timestamp;
}
export type LoanApplication = LoanApplicationDocument & { id: string };
export type NewLoanApplication = Omit<LoanApplicationDocument, 'createdAt'>;

export const LENDERS_COLLECTION = { collectionName: 'lenders' } as const;
export const LOAN_APPLICATIONS_COLLECTION = { collectionName: 'loanApplications' } as const;

const applications = () => db.collection(LOAN_APPLICATIONS_COLLECTION.collectionName);
const lenders = () => db.collection(LENDERS_COLLECTION.collectionName);

export const loanApplicationsRepository = {
  /** El id deriva de la clave de envío: dos envíos concurrentes de la misma clave disputan el mismo documento. */
  async insertOnce(id: string, document: NewLoanApplication): Promise<{ id: string; created: boolean; limited: boolean }> {
    const ref = applications().doc(id);
    return db.runTransaction(async (transaction) => {
      const existing = await transaction.get(ref);
      if (existing.exists) return { id, created: false, limited: false };

      // Se filtra la hora en memoria para no necesitar un índice compuesto sourceIp + createdAt.
      const sameIp = await transaction.get(applications().where('sourceIp', '==', document.sourceIp));
      const cutoff = Date.now() - 60 * 60 * 1000;
      const recentCount = sameIp.docs.filter((snapshot) => {
        const data = snapshot.data() as LoanApplicationDocument;
        return data.createdAt instanceof Timestamp && data.createdAt.toMillis() >= cutoff;
      }).length;
      if (recentCount >= 5) return { id, created: false, limited: true };

      transaction.create(ref, { ...document, createdAt: nowTimestamp() } satisfies LoanApplicationDocument);
      return { id, created: true, limited: false };
    });
  },

  async findById(id: string): Promise<LoanApplication | undefined> {
    return withId<LoanApplicationDocument>(await applications().doc(id).get());
  },

  async findActiveLenders(): Promise<Lender[]> {
    const snapshot = await lenders().where('active', '==', true).get();
    return snapshot.docs.map((doc) => ({ ...(doc.data() as LenderDocument), id: doc.id }));
  },

  /** La escritura es atómica; si falla, permanecen el estado y las ofertas anteriores. */
  async saveOffers(id: string, offers: StoredOffer[], status: ApplicationStatus): Promise<boolean> {
    const ref = applications().doc(id);
    return db.runTransaction(async (transaction) => {
      const existing = await transaction.get(ref);
      if (!existing.exists) return false;
      transaction.update(ref, { offers, status });
      return true;
    });
  },
};
