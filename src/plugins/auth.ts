import { FastifyInstance, FastifyPluginAsync, FastifyRequest, RouteGenericInterface } from 'fastify';
import fp from 'fastify-plugin';
import jwt, { FastifyJWT } from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { UnauthorizedError } from '@utils/errors';

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
    authenticate: <T extends RouteGenericInterface>(request: FastifyRequest<T>) => Promise<void>;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.register(fastifyCookie, {
    secret: fastify.config.COOKIE_SECRET,
    hook: 'preHandler',
  });

  fastify.register(jwt, {
    secret: fastify.config.JWT_SECRET,
    sign: {
      expiresIn: fastify.config.JWT_TTL,
    },
  });

  fastify.decorate('authenticate', async function (request: FastifyRequest) {
    const token = request.cookies.token;
    if (!token) {
      throw new UnauthorizedError('Unauthorized: missing token cookie');
    }

    try {
      const tokenUser = fastify.jwt.verify<FastifyJWT['user']>(token);
      request.user = tokenUser;
    } catch {
      throw new UnauthorizedError('Unauthorized: invalid token');
    }
  });
};

export default fp(authPlugin, { dependencies: ['config'] });
