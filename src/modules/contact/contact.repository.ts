import { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { countOf, nowTimestamp } from '../../shared/db/db-utils.js';
import type { ContactReason } from './contact.schemas.js';

/** Campos de mensajesContacto, según el script de carga de la base de datos. */
export interface ContactMessageDocument {
  name: string;
  email: string;
  phone: string | null;
  reason: ContactReason;
  message: string;
  acceptsPrivacy: true;
  privacyAcceptedAt: Timestamp;
  ipAddress: string;
  status: 'NUEVO';
  createdAt: Timestamp;
}

export type ContactMessage = ContactMessageDocument & { id: string };
export type NewContactMessage = Omit<ContactMessageDocument, 'privacyAcceptedAt' | 'createdAt'>;

export const CONTACT_MESSAGES_COLLECTION = { collectionName: 'mensajesContacto' } as const;
const collection = () => db.collection(CONTACT_MESSAGES_COLLECTION.collectionName);

export const contactRepository = {
  async countRecentByIp(ipAddress: string, since: number): Promise<number> {
    const query = collection()
      .where('ipAddress', '==', ipAddress)
      .where('createdAt', '>=', Timestamp.fromMillis(since));
    return countOf(query);
  },

  async insert(id: string, message: NewContactMessage): Promise<ContactMessage> {
    const now = nowTimestamp();
    const document: ContactMessageDocument = {
      ...message,
      privacyAcceptedAt: now,
      createdAt: now,
    };
    await collection().doc(id).create(document);
    return { ...document, id };
  },
};
