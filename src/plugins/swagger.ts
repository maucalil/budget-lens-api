import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { fastifySwagger } from '@fastify/swagger';
import {
  jsonSchemaTransform,
  jsonSchemaTransformObject,
} from 'fastify-type-provider-zod';
import { fastifySwaggerUi } from '@fastify/swagger-ui';

const swaggerPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'BudgetLens Api',
        description: 'TODO',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
    transformObject: jsonSchemaTransformObject,
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  });
};

export default fp(swaggerPlugin, { dependencies: ['config'] });
