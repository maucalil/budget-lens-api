import { AppError } from '@utils/errors';
import { FastifyInstance, FastifyPluginAsync, FastifyError } from 'fastify';
import fp from 'fastify-plugin';

interface ErrorResponse {
  success: false;
  message: string;
  issues?: unknown[];
}

function wrapError(message: string, issues?: unknown[]): ErrorResponse {
  return {
    success: false,
    message,
    ...(issues && issues.length > 0 ? { issues } : {}),
  };
}

const errorHandlerPlugin: FastifyPluginAsync = async (
  fastify: FastifyInstance
): Promise<void> => {
  fastify.setErrorHandler((error: FastifyError, request, reply): void => {
    console.log('ERROR CONSTRUCTOR:', error.constructor.name);
    console.log(error);
    if (error instanceof AppError) {
      if (error.statusCode >= 500) {
        request.log.error(error);
      }

      reply.status(error.statusCode).send(wrapError(error.message));
      return;
    }

    if (error.code === 'FST_ERR_VALIDATION' && error.validation) {
      const issues = (
        error.validation as { instancePath: string; message?: string }[]
      ).map(issue => ({
        path: issue.instancePath
          ? issue.instancePath.substring(1).split('/')
          : [],
        message: issue.message || 'Invalid input',
      }));
      reply.status(400).send(wrapError('Input validation failed', issues));
      return;
    }

    request.log.error(error);
    reply.status(500).send(wrapError(error.message));
  });
};

export default fp(errorHandlerPlugin, { dependencies: ['config'] });
