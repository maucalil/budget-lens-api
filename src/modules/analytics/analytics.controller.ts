import { FastifyReply, FastifyRequest } from 'fastify';
import { AnalyticsService } from './analytics.service';
import { AnalyticsCashFlowQuerySchema, AnalyticsCashFlowResSchema } from './analytics.schema';

export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  public getAnalyticsCashFlow = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const query = AnalyticsCashFlowQuerySchema.parse(request.query);
    const cashFlow = await this.service.getAnalyticsCashFlow(query);
    const parsedCashFlow = AnalyticsCashFlowResSchema.parse(cashFlow);
    reply.code(200).sendSuccess(parsedCashFlow);
  };
}
