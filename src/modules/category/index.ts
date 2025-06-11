import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import categoryRoutes from './category.route';

const categoryModule: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(categoryRoutes, {
    prefix: '/category',
  });
};

export default categoryModule;
