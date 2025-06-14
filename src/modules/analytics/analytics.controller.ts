import { FastifyReply, FastifyRequest } from 'fastify';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQuerySchema, AnalyticsCashFlowSchema, AnalyticsChartSchema } from './analytics.schema';

export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  public getCashFlow = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const query = AnalyticsQuerySchema.parse(request.query);
    const cashFlow = await this.service.getCashFlow(query);
    const parsedCashFlow = AnalyticsCashFlowSchema.parse(cashFlow);
    reply.code(200).sendSuccess(parsedCashFlow);
  };

  public getMonthlyIncomeExpense = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const query = AnalyticsQuerySchema.parse(request.query);
    const monthlyIncomeExpense = await this.service.getMonthlyIncomeExpense(query);
    const parsedMonthlyIncomeExpense = AnalyticsChartSchema.parse(monthlyIncomeExpense);
    reply.code(200).sendSuccess(parsedMonthlyIncomeExpense);
  };

  public getExpensesByCategory = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const query = AnalyticsQuerySchema.parse(request.query);
    const expensesByCategory = await this.service.getExpensesByCategory(query);
    const parsedExpensesByCategory = AnalyticsChartSchema.parse(expensesByCategory);
    reply.code(200).sendSuccess(parsedExpensesByCategory);
  };
}
