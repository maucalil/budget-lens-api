import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserCreateSchema, UserLoginSchema, UserResSchema } from './user.schema';
import { createSuccessResponseSchema, SimpleErrorResponseSchema } from '@utils/zod';
import { z } from 'zod/v4';

const userRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const userService = new UserService(fastify.prisma);
  const userController = new UserController(userService);
  const tags = ['User'];

  fastify.post(
    '/',
    {
      schema: {
        tags,
        description: 'Create a user',
        body: UserCreateSchema,
        response: {
          200: createSuccessResponseSchema(UserResSchema),
        },
      },
    },
    userController.createUser
  );

  fastify.post(
    '/login',
    {
      schema: {
        tags,
        description: 'Login user',
        body: UserLoginSchema,
        response: {
          200: z.null(),
        },
      },
    },
    userController.login
  );

  fastify.delete(
    '/logout',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags,
        description: 'Logout user by clearing JWT cookie',
        response: {
          200: z.null(),
          401: SimpleErrorResponseSchema,
        },
      },
    },
    userController.logout
  );

  fastify.get(
    '/session',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags,
        description: 'Check session status',
        response: {
          200: z.null(),
          401: SimpleErrorResponseSchema,
        },
      },
    },
    userController.checkSession
  );
};

export default userRoutes;
