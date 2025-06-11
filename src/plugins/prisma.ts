import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const prisma = new PrismaClient();

  await prisma.$connect().catch(error => {
    fastify.log.error(`${error.message}`);
    throw error;
  });
  fastify.log.info('Prisma client connected');

  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async server => {
    server.log.info('Disconnecting Prisma client');
    await server.prisma.$disconnect();
  });
};

export default fp(prismaPlugin, { dependencies: ['config'] });
