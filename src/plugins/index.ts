import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import configPlugin from './config';
import prismaPlugin from './prisma';
import swaggerPlugin from './swagger';
import errorHandlerPlugin from './error-handler';

const plugins: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(configPlugin);

  await Promise.all([
    fastify.register(prismaPlugin),
    fastify.register(swaggerPlugin),
    fastify.register(errorHandlerPlugin),
  ]);
};

export default fp(plugins);
