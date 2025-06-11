import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { GetCategoriesResSchema } from './category.schema';
import { CategoryService } from './category.service';
import CategoryController from './category.controller';

const categoryRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const categoryService = new CategoryService(fastify.prisma);
  const categoryController = new CategoryController(categoryService);

  fastify.get(
    '/',
    {
      schema: {
        tags: ['categories'],
        description: 'List all categories',
        response: {
          200: GetCategoriesResSchema,
        },
      },
    },
    categoryController.getCategories.bind(categoryController)
  );
};

export default categoryRoutes;
