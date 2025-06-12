import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import {
  TransactionCreateSchema,
  TransactionFilterSchema,
  TransactionParamsSchema,
  TransactionResSchema,
  TransactionsResSchema,
  TransactionUpdateSchema,
} from './transaction.schema';
import { createSuccessResponseSchema, SimpleErrorResponseSchema } from '@utils/zod';
import { z } from 'zod/v4';

const transactionRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const transactionService = new TransactionService(fastify.prisma);
  const transactionController = new TransactionController(transactionService);
  const tags = ['Transactions'];

  fastify.get(
    '/',
    {
      schema: {
        tags,
        description: 'List all transactions',
        querystring: TransactionFilterSchema,
        response: {
          200: createSuccessResponseSchema(TransactionsResSchema),
        },
      },
    },
    transactionController.getTransactions
  );

  fastify.get(
    '/:id',
    {
      schema: {
        tags,
        description: 'Get a single transaction by its ID',
        params: TransactionParamsSchema,
        response: {
          200: createSuccessResponseSchema(TransactionResSchema),
          404: SimpleErrorResponseSchema,
        },
      },
    },
    transactionController.getTransaction
  );

  fastify.post(
    '/',
    {
      schema: {
        tags,
        description: 'Create a transaction',
        body: TransactionCreateSchema,
        response: {
          201: createSuccessResponseSchema(TransactionResSchema),
          400: SimpleErrorResponseSchema,
          409: SimpleErrorResponseSchema,
        },
      },
    },
    transactionController.createTransaction
  );

  fastify.put(
    '/:id',
    {
      schema: {
        tags,
        description: 'Update a transaction by its ID',
        params: TransactionParamsSchema,
        body: TransactionUpdateSchema,
        response: {
          200: createSuccessResponseSchema(TransactionResSchema),
          400: SimpleErrorResponseSchema,
          404: SimpleErrorResponseSchema,
        },
      },
    },
    transactionController.updateTransaction
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        tags,
        description: 'Delete a transaction by its ID',
        params: TransactionParamsSchema,
        response: {
          204: z.null(),
          404: SimpleErrorResponseSchema,
        },
      },
    },
    transactionController.deleteTransaction
  );
};

export default transactionRoutes;
