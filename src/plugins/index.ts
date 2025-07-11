import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import configPlugin from './config';
import prismaPlugin from './prisma';
import swaggerPlugin from './swagger';
import errorHandlerPlugin from './error-handler';
import responseWrapperPlugin from './response-wrapper';
import authPlugin from './auth';
import corsPlugin from './cors';

const plugins: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(configPlugin);

  await Promise.all([
    fastify.register(prismaPlugin),
    fastify.register(swaggerPlugin),
    fastify.register(errorHandlerPlugin),
    fastify.register(responseWrapperPlugin),
    fastify.register(authPlugin),
    fastify.register(corsPlugin),
  ]);
};

export default fp(plugins);
