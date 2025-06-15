import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import {
  AccountCreateSchema,
  AccountParamsSchema,
  AccountResSchema,
  AccountsResSchema,
  AccountUpdateSchema,
} from './account.schema';
import { createSuccessResponseSchema, SimpleErrorResponseSchema } from '@utils/zod';
import { z } from 'zod/v4';

const accountRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const accountService = new AccountService(fastify.prisma);
  const accountController = new AccountController(accountService);
  const tags = ['Accounts'];

  fastify.get(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags,
        description: 'List all accounts',
        response: {
          200: createSuccessResponseSchema(AccountsResSchema),
        },
      },
    },
    accountController.getAccounts
  );

  fastify.get(
    '/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags,
        description: 'Get a single account by its ID',
        params: AccountParamsSchema,
        response: {
          200: createSuccessResponseSchema(AccountResSchema),
          404: SimpleErrorResponseSchema,
        },
      },
    },
    accountController.getAccountById
  );

  fastify.post(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags,
        description: 'Create a new account',
        body: AccountCreateSchema,
        response: {
          201: createSuccessResponseSchema(AccountResSchema),
          400: SimpleErrorResponseSchema,
          409: SimpleErrorResponseSchema,
        },
      },
    },
    accountController.createAccount
  );

  fastify.put(
    '/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags,
        description: 'Update a account by its ID',
        params: AccountParamsSchema,
        body: AccountUpdateSchema,
        response: {
          200: createSuccessResponseSchema(AccountResSchema),
          400: SimpleErrorResponseSchema,
          404: SimpleErrorResponseSchema,
        },
      },
    },
    accountController.updateAccount
  );

  fastify.delete(
    '/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags,
        description: 'Delete an account by its ID',
        params: AccountParamsSchema,
        response: {
          204: z.null(),
          404: SimpleErrorResponseSchema,
        },
      },
    },
    accountController.deleteAccount
  );
};

export default accountRoutes;
