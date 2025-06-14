import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserCreateSchema, UserLoginResSchema, UserLoginSchema, UserResSchema } from './user.schema';
import { createSuccessResponseSchema } from '@utils/zod';

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
        description: 'Login user and return JWT token',
        body: UserLoginSchema,
        response: {
          200: createSuccessResponseSchema(UserLoginResSchema),
        },
      },
    },
    userController.login
  );
};

export default userRoutes;
