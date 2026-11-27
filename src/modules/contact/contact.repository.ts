import { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { nowTimestamp } from '../../shared/db/db-utils.js';
import { HttpError } from '../../shared/errors/http-errors.js';
import type { ContactReason } from './contact.schemas.js';

/** Campos de contactMessages, conforme al script de carga V8__contact.js. */
export interface ContactMessageDocument {
  name: string;
  email: string;
  phone: string | null;
  reason: ContactReason;
  message: string;
  privacyAccepted: true;
  privacyAcceptedAt: Timestamp;
  ip: string;
  status: 'NUEVO';
  createdAt: Timestamp;
}

export type ContactMessage = ContactMessageDocument & { id: string };
export type NewContactMessage = Omit<ContactMessageDocument, 'privacyAcceptedAt' | 'createdAt'>;

export const CONTACT_MESSAGES_COLLECTION = { collectionName: 'contactMessages' } as const;
const collection = () => db.collection(CONTACT_MESSAGES_COLLECTION.collectionName);

export const contactRepository = {
  /** La comprobación del límite y el alta forman una única transacción. */
  async insertWithinHourlyLimit(id: string, message: NewContactMessage): Promise<ContactMessage> {
    return db.runTransaction(async (transaction) => {
      const previous = await transaction.get(collection().where('ip', '==', message.ip));
      const now = nowTimestamp();
      const hourAgo = now.toMillis() - 60 * 60 * 1000;
      const recent = previous.docs.filter((doc) => {
        const data = doc.data() as ContactMessageDocument;
        return data.createdAt.toMillis() >= hourAgo;
      });
      if (recent.length >= 3) {
        throw new HttpError(429, 'CONTACT_RATE_LIMIT', 'Has alcanzado el límite de tres mensajes por hora. Inténtalo más tarde.');
      }

      const document: ContactMessageDocument = {
        ...message,
        privacyAcceptedAt: now,
        createdAt: now,
      };
      transaction.create(collection().doc(id), document);
      return { ...document, id };
    });
  },
};
