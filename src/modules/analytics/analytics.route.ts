import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsCashFlowReqSchema, AnalyticsCashFlowResSchema } from './analytics.schema';
import { createSuccessResponseSchema } from '@utils/zod';

const analyticsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const analyticsService = new AnalyticsService(fastify.prisma);
  const analyticsController = new AnalyticsController(analyticsService);
  const tags = ['Analytics'];

  fastify.get(
    '/cashflow',
    {
      schema: {
        tags,
        description: 'Get the total income, expenses, and balance for a specified month',
        querystring: AnalyticsCashFlowReqSchema,
        response: {
          200: createSuccessResponseSchema(AnalyticsCashFlowResSchema),
        },
      },
    },
    analyticsController.getAnalyticsCashFlow
  );
};

export default analyticsRoutes;
