import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { CategoriesResSchema } from './category.schema';
import { CategoryService } from './category.service';
import CategoryController from './category.controller';
import { createSuccessResponseSchema, SimpleErrorResponseSchema } from '@utils/zod';

const categoryRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const categoryService = new CategoryService(fastify.prisma);
  const categoryController = new CategoryController(categoryService);

  fastify.get(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['Category'],
        description: 'List all categories',
        response: {
          200: createSuccessResponseSchema(CategoriesResSchema),
          401: SimpleErrorResponseSchema,
        },
      },
    },
    categoryController.getCategories
  );
};

export default categoryRoutes;
