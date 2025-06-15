import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';

import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import plugins from './plugins';
import modules from './modules';

function getLoggerConfig(): FastifyServerOptions['logger'] {
  switch (process.env.NODE_ENV) {
    case 'local':
      return {
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      };
    case 'test':
      return false;
    default:
      return true;
  }
}

export async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: getLoggerConfig(),
  }).withTypeProvider<ZodTypeProvider>();

  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  await fastify.register(plugins);
  await fastify.register(modules, { prefix: '/api/v1' });

  return fastify;
}
