import { Timestamp, type Query } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { countOf, withId } from '../../shared/db/db-utils.js';
import type { ArticleCategory, ArticleListQuery } from './blog.schemas.js';

export interface ArticleSectionDocument {
  id: string;
  titulo: string;
  contenidoHtml: string;
}

/** Campos exactos de los documentos cargados en articulos. */
export interface ArticleDocument {
  slug: string;
  titulo: string;
  categoria: ArticleCategory;
  resumen: string;
  imagenUrl: string;
  autor: string;
  fechaPublicacion: Timestamp;
  fechaActualizacion: Timestamp;
  minutosLectura: number;
  secciones: ArticleSectionDocument[];
  relacionados: string[];
  metaTitulo: string;
  metaDescripcion: string;
  publicado: boolean;
  createdAt: Timestamp;
}

export type Article = ArticleDocument & { id: string };
export const ARTICULOS_COLLECTION = { collectionName: 'articulos' } as const;
const collection = () => db.collection(ARTICULOS_COLLECTION.collectionName);

const published = (today: Timestamp, categoria?: ArticleCategory): Query => {
  let query: Query = collection().where('publicado', '==', true)
    .where('fechaPublicacion', '<=', today);
  if (categoria) query = query.where('categoria', '==', categoria);
  // Requiere índices compuestos: publicado + fechaPublicacion desc y
  // publicado + categoria + fechaPublicacion desc (colección articulos).
  return query.orderBy('fechaPublicacion', 'desc');
};

export const blogRepository = {
  async findPage(query: ArticleListQuery, today: Timestamp): Promise<{ items: Article[]; total: number }> {
    const base = published(today, query.categoria);
    const [snapshot, total] = await Promise.all([
      base.offset((query.pagina - 1) * 9).limit(9).get(),
      countOf(base),
    ]);
    return {
      items: snapshot.docs.map((doc) => ({ ...(doc.data() as ArticleDocument), id: doc.id })),
      total,
    };
  },

  async findBySlug(slug: string): Promise<Article | undefined> {
    return withId<ArticleDocument>(await collection().doc(slug).get());
  },

  async findRelated(slugs: string[]): Promise<Article[]> {
    const snapshots = await Promise.all(slugs.map((slug) => collection().doc(slug).get()));
    return snapshots.flatMap((snapshot) => {
      const article = withId<ArticleDocument>(snapshot);
      return article ? [article] : [];
    });
  },
};
