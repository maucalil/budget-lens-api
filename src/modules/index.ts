import { FastifyInstance, FastifyPluginAsync } from 'fastify';

const modules: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await Promise.all([]); // TODO: add promises for registering each module, as in plugins/index.ts
};

export default modules;
