import type { Query, Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { countOf, nowTimestamp, withId } from '../../shared/db/db-utils.js';
import type { ArticleCategory, ArticleListQuery } from './blog.schemas.js';

export interface ArticleSectionDocument {
  id: string;
  title: string;
  contentHtml: string;
}

export interface ArticleDocument {
  slug: string;
  title: string;
  category: ArticleCategory;
  summary: string;
  imageUrl: string;
  author: string;
  publishedAt: Timestamp;
  updatedAt: Timestamp;
  createdAt: Timestamp;
  readingMinutes: number;
  sections: ArticleSectionDocument[];
  relatedSlugs: string[];
  metaTitle: string;
  metaDescription: string;
  published: boolean;
}

export type Article = ArticleDocument & { id: string };
export const ARTICLES_COLLECTION = { collectionName: 'articles' } as const;
const collection = () => db.collection(ARTICLES_COLLECTION.collectionName);

/** Requiere índices compuestos published + publishedAt y category + published + publishedAt en firestore.indexes.json. */
const filtered = (query: ArticleListQuery, now: Timestamp): Query => {
  let result: Query = collection().where('published', '==', true);
  if (query.category) result = result.where('category', '==', query.category);
  return result.where('publishedAt', '<=', now).orderBy('publishedAt', 'desc');
};

export const blogRepository = {
  async findPage(query: ArticleListQuery): Promise<{ items: Article[]; total: number }> {
    const base = filtered(query, nowTimestamp());
    const [snapshot, total] = await Promise.all([
      base.offset((query.page - 1) * query.size).limit(query.size).get(),
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
