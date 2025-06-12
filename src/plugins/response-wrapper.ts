import { FastifyInstance, FastifyPluginAsync, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

interface SuccessResponse<T> {
  success: true;
  data: T;
}

function wrapSuccess<T>(data: T): SuccessResponse<T> {
  return { success: true, data };
}

declare module 'fastify' {
  interface FastifyReply {
    sendSuccess<T>(data: T): FastifyReply;
  }
}

const responseWrapperPlugin: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify.decorateReply('sendSuccess', function <T>(this: FastifyReply, data: T): FastifyReply {
    return this.send(wrapSuccess(data));
  });
};

export default fp(responseWrapperPlugin, { dependencies: ['config'] });
