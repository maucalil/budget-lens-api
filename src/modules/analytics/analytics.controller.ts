import { FastifyReply, FastifyRequest } from 'fastify';
import { AnalyticsService } from './analytics.service';
import { AnalyticsCashFlowReqSchema, AnalyticsCashFlowResSchema } from './analytics.schema';

export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  public getAnalyticsCashFlow = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const dateFilter = AnalyticsCashFlowReqSchema.parse(request.query);
    const cashFlow = await this.service.getAnalyticsCashFlow(dateFilter);
    const parsedCashFlow = AnalyticsCashFlowResSchema.parse(cashFlow);
    reply.code(200).sendSuccess(parsedCashFlow);
  };
}
