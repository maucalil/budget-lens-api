import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import analyticsRoutes from './analytics.route';

const analyticsModule: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(analyticsRoutes, {
    prefix: '/analytics',
  });
};

export default analyticsModule;
