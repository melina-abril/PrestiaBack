import { toIsoDateTime } from '../../shared/db/db-utils.js';
import { NotFoundError } from '../../shared/errors/http-errors.js';
import { blogRepository, type Article } from './blog.repository.js';
import type { ArticleListQuery, ArticlePageResponse, ArticleResponse, ArticleSummaryResponse, RelatedArticleResponse } from './blog.schemas.js';

const isAvailable = (article: Article, now: number): boolean => article.published && article.publishedAt.toMillis() <= now;

const toSummary = (article: Article): ArticleSummaryResponse => ({
  slug: article.slug,
  title: article.title,
  category: article.category,
  summary: article.summary,
  imageUrl: article.imageUrl,
  publishedAt: toIsoDateTime(article.publishedAt),
  readingMinutes: article.readingMinutes,
});

/** Solo se conservan etiquetas de presentación y enlaces HTTP(S); nunca se copian atributos del HTML de origen. */
const ALLOWED_TAGS = new Set(['p', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td']);
const BLOCKED_TAGS = new Set(['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'template']);
const escapeHtml = (value: string): string => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const safeHref = (attributes: string): string | undefined => {
  const match = /(?:^|\s)href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i.exec(attributes);
  const href = (match?.[1] ?? match?.[2] ?? match?.[3])?.trim();
  if (!href || !/^https?:\/\//i.test(href)) return undefined;
  try {
    const url = new URL(href);
    return url.protocol === 'http:' || url.protocol === 'https:' ? href : undefined;
  } catch {
    return undefined;
  }
};

/** Tokeniza respetando las comillas de las etiquetas para que un '>' dentro de un atributo no cierre la etiqueta. */
const tagEnd = (html: string, start: number): number => {
  let quote = '';
  for (let index = start + 1; index < html.length; index += 1) {
    const character = html[index];
    if (quote) {
      if (character === quote) quote = '';
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '>') {
      return index;
    }
  }
  return -1;
};

const sanitizeHtml = (html: string): string => {
  let output = '';
  let position = 0;
  const openTags: string[] = [];
  const blocked: string[] = [];

  while (position < html.length) {
    const start = html.indexOf('<', position);
    if (start < 0) {
      if (blocked.length === 0) output += escapeHtml(html.slice(position));
      break;
    }
    if (blocked.length === 0) output += escapeHtml(html.slice(position, start));
    if (html.startsWith('<!--', start)) {
      const end = html.indexOf('-->', start + 4);
      if (end < 0) break;
      position = end + 3;
      continue;
    }
    const end = tagEnd(html, start);
    if (end < 0) {
      if (blocked.length === 0) output += '&lt;';
      position = start + 1;
      continue;
    }
    const token = html.slice(start + 1, end);
    position = end + 1;
    const match = /^(\/?)\s*([a-z][a-z0-9-]*)([\s\S]*)$/i.exec(token);
    if (!match) continue;
    const closing = match[1] === '/';
    const name = match[2]?.toLowerCase() ?? '';
    const attributes = match[3] ?? '';

    if (blocked.length > 0) {
      if (BLOCKED_TAGS.has(name)) {
        if (closing) {
          if (blocked[blocked.length - 1] === name) blocked.pop();
        } else if (!/\/\s*$/.test(attributes)) {
          blocked.push(name);
        }
      }
      continue;
    }
    if (BLOCKED_TAGS.has(name)) {
      if (!closing && !/\/\s*$/.test(attributes)) blocked.push(name);
      continue;
    }
    if (!ALLOWED_TAGS.has(name)) continue;
    if (closing) {
      const index = openTags.lastIndexOf(name);
      if (index < 0) continue;
      while (openTags.length > index) output += `</${openTags.pop()}>`;
      continue;
    }
    if (name === 'a') {
      const href = safeHref(attributes);
      output += href ? `<a href="${escapeHtml(href)}" rel="noopener noreferrer">` : '<a>';
    } else {
      output += `<${name}>`;
    }
    openTags.push(name);
  }
  while (openTags.length > 0) output += `</${openTags.pop()}>`;
  return output;
};

export const blogService = {
  async listArticles(query: ArticleListQuery): Promise<ArticlePageResponse> {
    const { items, total } = await blogRepository.findPage(query);
    return {
      items: items.map(toSummary),
      page: query.page,
      size: query.size,
      totalItems: total,
      totalPages: Math.ceil(total / query.size),
    };
  },

  async getArticle(slug: string): Promise<ArticleResponse> {
    const article = await blogRepository.findBySlug(slug);
    const now = Date.now();
    if (!article || !isAvailable(article, now)) throw new NotFoundError(`No existe el artículo ${slug}.`);
    const related = await blogRepository.findRelated(article.relatedSlugs);
    const relatedArticles: RelatedArticleResponse[] = related.filter((item) => isAvailable(item, now)).map((item) => ({
      slug: item.slug,
      title: item.title,
      category: item.category,
    }));
    return {
      ...toSummary(article),
      author: article.author,
      updatedAt: toIsoDateTime(article.updatedAt),
      sections: article.sections.map((section) => ({
        id: section.id,
        title: section.title,
        contentHtml: sanitizeHtml(section.contentHtml),
      })),
      relatedArticles,
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
    };
  },
};
