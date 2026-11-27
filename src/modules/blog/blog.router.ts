import { Router } from 'express';
import { parse } from '../../shared/http/validation.js';
import { articleListQuerySchema, articleSlugParamSchema } from './blog.schemas.js';
import { blogService } from './blog.service.js';

export const blogRouter = Router();

blogRouter.get('/', async (req, res) => {
  res.json(await blogService.listArticles(parse(articleListQuerySchema, req.query)));
});

blogRouter.get('/:slug', async (req, res) => {
  const { slug } = parse(articleSlugParamSchema, req.params);
  res.json(await blogService.getArticle(slug));
});
