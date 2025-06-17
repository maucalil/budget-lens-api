import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsQuerySchema, AnalyticsCashFlowSchema, AnalyticsChartSchema } from './analytics.schema';
import { createSuccessResponseSchema, SimpleErrorResponseSchema } from '@utils/zod';

const analyticsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const analyticsService = new AnalyticsService(fastify.prisma);
  const analyticsController = new AnalyticsController(analyticsService);
  const tags = ['Analytics'];

  fastify.get(
    '/cash-flow',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags,
        description: 'Get the total income, expenses, and balance for a given month',
        querystring: AnalyticsQuerySchema,
        response: {
          200: createSuccessResponseSchema(AnalyticsCashFlowSchema),
          401: SimpleErrorResponseSchema,
        },
      },
    },
    analyticsController.getCashFlow
  );

  fastify.get(
    '/monthly-income-expense',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags,
        description:
          'Retrieves monthly aggregated data of total income and expenses, formatted for chart visualization',
        querystring: AnalyticsQuerySchema,
        response: {
          200: createSuccessResponseSchema(AnalyticsChartSchema),
          401: SimpleErrorResponseSchema,
        },
      },
    },
    analyticsController.getMonthlyIncomeExpense
  );

  fastify.get(
    '/expenses-by-category',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags,
        description:
          'Retrieves the total expenses by category for a given month and year, formatted for chart visualization',
        querystring: AnalyticsQuerySchema,
        response: {
          200: createSuccessResponseSchema(AnalyticsChartSchema),
          401: SimpleErrorResponseSchema,
        },
      },
    },
    analyticsController.getExpensesByCategory
  );
};

export default analyticsRoutes;
