import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fp from 'fastify-plugin';

interface SuccessResponse<T> {
  success: true;
  data: T;
}

function wrapSuccess<T>(data: T): SuccessResponse<T> {
  return { success: true, data };
}

const responseWrapperPlugin: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.addHook(
    'onSend',
    async (
      request: FastifyRequest,
      reply: FastifyReply,
      payload: unknown
    ): Promise<unknown> => {
      // Skip wrapping for errors or Swagger routes
      if (reply.statusCode >= 400 || request.raw.url?.startsWith('/docs')) {
        return payload;
      }

      // Skip non-string payloads (e.g. buffers or streams)
      if (typeof payload !== 'string') {
        return payload;
      }

      let parsedPayload: object | string;

      try {
        parsedPayload = JSON.parse(payload);
      } catch {
        // Leave non-JSON strings untouched
        return payload;
      }

      // Avoid double-wrapping if already in success format
      if (
        typeof parsedPayload === 'object' &&
        parsedPayload !== null &&
        'success' in parsedPayload &&
        (parsedPayload as { success: boolean }).success === true
      ) {
        return payload;
      }

      return JSON.stringify(wrapSuccess(parsedPayload));
    }
  );
};

export default fp(responseWrapperPlugin, { dependencies: ['config'] });
