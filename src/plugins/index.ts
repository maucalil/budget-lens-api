import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import configPlugin from './config';
import prismaPlugin from './prisma';
import swaggerPlugin from './swagger';

const plugins: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(configPlugin);

  await Promise.all([
    fastify.register(prismaPlugin),
    fastify.register(swaggerPlugin),
  ]);
};

export default fp(plugins);
