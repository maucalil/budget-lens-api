import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

declare module '@fastify/jwt' {
  interface JwtPayload {
    id: number;
  }

  interface FastifyJWT {
    user: JwtPayload;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: <T extends RouteGenericInterface>(request: FastifyRequest<T>, reply: FastifyReply) => Promise<void>;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.register(jwt, {
    secret: fastify.config.JWT_SECRET,
    sign: {
      expiresIn: fastify.config.JWT_TTL,
    },
  });

  fastify.decorate('authenticate', async function (request: FastifyRequest, _reply: FastifyReply) {
    await request.jwtVerify();
  });
};

export default fp(authPlugin, { dependencies: ['config'] });
