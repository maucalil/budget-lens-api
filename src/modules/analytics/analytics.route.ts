import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsQuerySchema, AnalyticsCashFlowSchema, AnalyticsChartSchema } from './analytics.schema';
import { createSuccessResponseSchema } from '@utils/zod';

const analyticsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const analyticsService = new AnalyticsService(fastify.prisma);
  const analyticsController = new AnalyticsController(analyticsService);
  const tags = ['Analytics'];

  fastify.get(
    '/cash-flow',
    {
      schema: {
        tags,
        description: 'Get the total income, expenses, and balance for a specified month',
        querystring: AnalyticsQuerySchema,
        response: {
          200: createSuccessResponseSchema(AnalyticsCashFlowSchema),
        },
      },
    },
    analyticsController.getAnalyticsCashFlow
  );

  fastify.get(
    '/income-expense',
    {
      schema: {
        tags,
        description: 'Retrieves monthly aggregated data of total income and expenses to be used for generating a chart',
        querystring: AnalyticsQuerySchema,
        response: {
          200: createSuccessResponseSchema(AnalyticsChartSchema),
        },
      },
    },
    analyticsController.getAnalyticsIncomeExpense
  );
};

export default analyticsRoutes;
