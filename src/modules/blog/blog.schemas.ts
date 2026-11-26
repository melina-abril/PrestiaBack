import { z } from 'zod';

export const ARTICLE_CATEGORIES = ['Préstamos', 'Seguridad', 'ASNEF', 'Educación financiera', 'Consejos', 'Legal'] as const;
export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

const categorySchema = z.enum(ARTICLE_CATEGORIES, { error: 'Selecciona una categoría válida.' });

export const articleListQuerySchema = z.object({
  categoria: z.union([categorySchema, z.literal('')]).optional().transform((value) => value || undefined),
  pagina: z.string().regex(/^[1-9]\d*$/, 'La página tiene que ser un entero mayor o igual a 1.').default('1')
    .transform(Number).refine(Number.isSafeInteger, 'La página es demasiado grande.'),
});
export type ArticleListQuery = z.output<typeof articleListQuerySchema>;

export const articleSlugParamSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El identificador del artículo no es válido.'),
});

export interface ArticleSummaryResponse {
  slug: string;
  titulo: string;
  categoria: ArticleCategory;
  resumen: string;
  imagenUrl: string;
  fechaPublicacion: string;
  minutosLectura: number;
}

export interface ArticleListResponse {
  articulos: ArticleSummaryResponse[];
  pagina: number;
  totalArticulos: number;
  totalPaginas: number;
}

export interface ArticleSectionResponse {
  id: string;
  titulo: string;
  contenidoHtml: string;
}

export interface RelatedArticleResponse {
  slug: string;
  titulo: string;
  categoria: ArticleCategory;
}

export interface ArticleResponse extends ArticleSummaryResponse {
  autor: string;
  fechaActualizacion: string;
  secciones: ArticleSectionResponse[];
  relacionados: RelatedArticleResponse[];
  metaTitulo: string;
  metaDescripcion: string;
}
