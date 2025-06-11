import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const errorHandlerPlugin: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  fastify.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode ?? 500;

    if (statusCode >= 500) {
      request.log.error(error);
    }

    reply.status(statusCode).send({
      error: error.name ?? 'InternalServerError',
      message: error.message ?? 'Something went wrong',
    });
  });
};

export default fp(errorHandlerPlugin, { dependencies: ['config'] });
