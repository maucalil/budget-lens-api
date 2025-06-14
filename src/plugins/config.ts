import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';
import { z } from 'zod/v4';

export const configSchema = z.object({
  NODE_ENV: z.enum(['local', 'dev', 'prod', 'test']).default('local'),
  DATABASE_URL: z.string(),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().int().positive().default(3000),
  JWT_SECRET: z.string(),
  JWT_TTL: z.string(),
});

type Config = z.infer<typeof configSchema>;

declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
  }
}

const configPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const configOptions = {
    schema: z.toJSONSchema(configSchema, { target: 'draft-7' }),
    dotenv: true,
    removeAdditional: true,
  };
  await fastify.register(fastifyEnv, configOptions);
};

export default fp(configPlugin, { name: 'config' });
