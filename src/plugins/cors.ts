import fastifyCors from '@fastify/cors';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const corsPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.register(fastifyCors, {
    origin: fastify.config.ALLOWED_ORIGINS.split(',').map(str => str.trim()),
    credentials: true,
    allowedHeaders: ['Content-Type'],
  });
};

export default fp(corsPlugin, { dependencies: ['config'] });
