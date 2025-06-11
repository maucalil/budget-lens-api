import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import transactionRoutes from './transaction.route';

const transactionModule: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  await fastify.register(transactionRoutes, {
    prefix: '/transaction',
  });
};

export default transactionModule;
