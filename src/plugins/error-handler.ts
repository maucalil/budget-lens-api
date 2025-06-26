import { Prisma } from '@prisma/client';
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

const errorHandlerPlugin: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify.setErrorHandler((error: FastifyError, request, reply): void => {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send(wrapError(error.message));
      return;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = (error.meta?.target as string[])?.join(', ');
        reply.status(400).send(wrapError(`Unique constraint failed: ${target} already exists.`));
        return;
      }

      if (error.code === 'P2003') {
        reply
          .status(400)
          .send(wrapError(`Foreign key constraint violated. Invalid or missing '${error.meta?.constraint}'`));
        return;
      }

      if (error.code === 'P2025') {
        reply.status(404).send(wrapError(`${error.meta?.modelName}: ${error.meta?.cause}`));
        return;
      }
    }

    if (error.code === 'FST_ERR_VALIDATION' && error.validation) {
      const issues = (error.validation as { instancePath: string; message?: string }[]).map(issue => ({
        path: issue.instancePath ? issue.instancePath.substring(1).split('/') : [],
        message: issue.message || 'Invalid input',
      }));
      reply.status(400).send(wrapError('Input validation failed', issues));
      return;
    }

    if (error.statusCode === 401) {
      reply.status(401).send(wrapError('Unauthorized: Invalid or expired token'));
      return;
    }

    request.log.error(error);
    reply.status(500).send(wrapError(error.message));
  });
};

export default fp(errorHandlerPlugin, { dependencies: ['config'] });
