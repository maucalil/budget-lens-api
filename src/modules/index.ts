import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import transactionModule from './transaction';
import categoryModule from './category';

const modules: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await Promise.all([
    fastify.register(categoryModule),
    fastify.register(transactionModule),
  ]);
};

export default modules;
