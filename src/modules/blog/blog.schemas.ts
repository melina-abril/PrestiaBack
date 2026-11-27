import { z } from 'zod';
import { pageQuerySchema } from '../../shared/http/page.js';

export const ARTICLE_CATEGORIES = ['Préstamos', 'Seguridad', 'ASNEF', 'Educación financiera', 'Consejos', 'Legal'] as const;
export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

const pageSchema = z.string().regex(/^[1-9][0-9]*$/, 'La página debe ser un entero mayor o igual a 1.').default('1').transform(Number).refine(Number.isSafeInteger, 'La página es demasiado grande.');

/** La página empieza en 1 y el tamaño del blog es siempre 9. */
export const articleListQuerySchema = pageQuerySchema.extend({
  page: pageSchema,
  size: z.coerce.number<number>().int().min(9).max(9).default(9),
  category: z.enum(ARTICLE_CATEGORIES, { error: 'Selecciona una categoría válida.' }).optional(),
});
export type ArticleListQuery = z.output<typeof articleListQuerySchema>;

export const articleSlugParamSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El artículo solicitado no es válido.'),
});

export interface ArticleSummaryResponse {
  slug: string;
  title: string;
  category: ArticleCategory;
  summary: string;
  imageUrl: string;
  publishedAt: string;
  readingMinutes: number;
}

export interface RelatedArticleResponse {
  slug: string;
  title: string;
  category: ArticleCategory;
}

export interface ArticleSectionResponse {
  id: string;
  title: string;
  contentHtml: string;
}

export interface ArticleResponse extends ArticleSummaryResponse {
  author: string;
  updatedAt: string;
  sections: ArticleSectionResponse[];
  relatedArticles: RelatedArticleResponse[];
  metaTitle: string;
  metaDescription: string;
}

export interface ArticlePageResponse {
  items: ArticleSummaryResponse[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}
