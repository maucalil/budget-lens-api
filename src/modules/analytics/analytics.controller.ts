import { FastifyReply, FastifyRequest } from 'fastify';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQuerySchema, AnalyticsCashFlowSchema, AnalyticsChartSchema } from './analytics.schema';

export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  public getAnalyticsCashFlow = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const query = AnalyticsQuerySchema.parse(request.query);
    const cashFlow = await this.service.getAnalyticsCashFlow(query);
    const parsedCashFlow = AnalyticsCashFlowSchema.parse(cashFlow);
    reply.code(200).sendSuccess(parsedCashFlow);
  };

  public getAnalyticsIncomeExpense = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const query = AnalyticsQuerySchema.parse(request.query);
    const incomeExpense = await this.service.getAnalyticsIncomeExpense(query);
    const parsedIncomeExpense = AnalyticsChartSchema.parse(incomeExpense);
    reply.code(200).sendSuccess(parsedIncomeExpense);
  };
}
