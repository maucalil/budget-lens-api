import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import transactionModule from './transaction';
import categoryModule from './category';
import accountModule from './account';
import analyticsModule from './analytics';

const modules: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await Promise.all([
    fastify.register(categoryModule),
    fastify.register(transactionModule),
    fastify.register(accountModule),
    fastify.register(analyticsModule),
  ]);
};

export default modules;
