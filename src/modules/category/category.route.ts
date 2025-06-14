import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { CategoriesResSchema } from './category.schema';
import { CategoryService } from './category.service';
import CategoryController from './category.controller';
import { createSuccessResponseSchema } from '@utils/zod';

const categoryRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const categoryService = new CategoryService(fastify.prisma);
  const categoryController = new CategoryController(categoryService);

  fastify.get(
    '/',
    {
      schema: {
        tags: ['Categories'],
        description: 'List all categories',
        response: {
          200: createSuccessResponseSchema(CategoriesResSchema),
        },
      },
    },
    categoryController.getCategories
  );
};

export default categoryRoutes;
