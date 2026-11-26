import { Timestamp } from 'firebase-admin/firestore';
import { toIsoDateTime } from '../../shared/db/db-utils.js';
import { NotFoundError } from '../../shared/errors/http-errors.js';
import { blogRepository, type Article } from './blog.repository.js';
import type {
  ArticleListQuery, ArticleListResponse, ArticleResponse,
  ArticleSummaryResponse, RelatedArticleResponse,
} from './blog.schemas.js';

const escapeHtml = (text: string): string => text.replace(/[&<>"']/g, (character) => {
  const replacements: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  };
  return replacements[character] ?? character;
});

const ALLOWED_TAGS = new Set(['p', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td']);

/** Reconstruye el HTML con etiquetas permitidas, sin conservar atributos salvo href seguro. */
const sanitizeHtml = (html: string): string => {
  const stripped = html.replace(/<\s*(script|style|iframe)\b[^>]*>[\s\S]*?(?:<\s*\/\s*\1\s*>|$)/gi, '');
  const tokens = stripped.match(/<[^>]*>|[^<]+|</g) ?? [];
  const open: string[] = [];
  let result = '';

  for (const token of tokens) {
    if (!token.startsWith('<')) {
      result += escapeHtml(token);
      continue;
    }
    if (/^<!--/.test(token)) continue;
    const tag = /^<\s*(\/?)\s*([a-z][a-z0-9]*)\b([^>]*)>$/i.exec(token);
    if (!tag) {
      result += escapeHtml(token);
      continue;
    }
    const name = tag[2]?.toLowerCase();
    if (!name || !ALLOWED_TAGS.has(name)) continue;
    if (tag[1] === '/') {
      const index = open.lastIndexOf(name);
      if (index < 0) continue;
      while (open.length > index) result += `</${open.pop()}>`;
      continue;
    }

    if (name === 'a') {
      const attributes = tag[3] ?? '';
      const href = /(?:^|\s)href\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(attributes);
      const rawUrl = href?.[1] ?? href?.[2];
      if (rawUrl && /^https?:\/\//i.test(rawUrl)) {
        try {
          const url = new URL(rawUrl);
          if (url.protocol === 'http:' || url.protocol === 'https:') {
            result += `<a href="${escapeHtml(url.href)}">`;
            open.push(name);
          }
        } catch {
          // Un enlace inválido se omite; su texto sigue siendo visible.
        }
      }
      continue;
    }
    result += `<${name}>`;
    open.push(name);
  }
  while (open.length) result += `</${open.pop()}>`;
  return result;
};

const isAvailable = (article: Article, now: Timestamp): boolean =>
  article.publicado && article.fechaPublicacion.toMillis() <= now.toMillis();

const toSummary = (article: Article): ArticleSummaryResponse => ({
  slug: article.slug,
  titulo: article.titulo,
  categoria: article.categoria,
  resumen: article.resumen,
  imagenUrl: article.imagenUrl,
  fechaPublicacion: toIsoDateTime(article.fechaPublicacion),
  minutosLectura: article.minutosLectura,
});

const toRelated = (article: Article): RelatedArticleResponse => ({
  slug: article.slug,
  titulo: article.titulo,
  categoria: article.categoria,
});

export const blogService = {
  async list(query: ArticleListQuery): Promise<ArticleListResponse> {
    const { items, total } = await blogRepository.findPage(query, Timestamp.now());
    return {
      articulos: items.map(toSummary),
      pagina: query.pagina,
      totalArticulos: total,
      totalPaginas: Math.ceil(total / 9),
    };
  },

  async get(slug: string): Promise<ArticleResponse> {
    const now = Timestamp.now();
    const article = await blogRepository.findBySlug(slug);
    if (!article || !isAvailable(article, now)) throw new NotFoundError('El artículo no está disponible.');
    const related = await blogRepository.findRelated(article.relacionados);
    const bySlug = new Map(related.filter((item) => isAvailable(item, now)).map((item) => [item.slug, item]));
    return {
      ...toSummary(article),
      autor: article.autor,
      fechaActualizacion: toIsoDateTime(article.fechaActualizacion),
      secciones: article.secciones.map((section) => ({
        id: section.id,
        titulo: section.titulo,
        contenidoHtml: sanitizeHtml(section.contenidoHtml),
      })),
      relacionados: article.relacionados.flatMap((relatedSlug) => {
        const item = bySlug.get(relatedSlug);
        return item ? [toRelated(item)] : [];
      }),
      metaTitulo: article.metaTitulo,
      metaDescripcion: article.metaDescripcion,
    };
  },
};
