import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import userRoutes from './user.route';

const userModule: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(userRoutes, {
    prefix: '/user',
  });
};

export default userModule;
