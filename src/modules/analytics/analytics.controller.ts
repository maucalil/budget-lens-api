import { FastifyReply, FastifyRequest } from 'fastify';
import { AnalyticsService } from './analytics.service';
import { AnalyticsCashFlowSchema, AnalyticsChartSchema, AnalyticsQuery } from './analytics.schema';

export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  public getCashFlow = async (
    request: FastifyRequest<{ Querystring: AnalyticsQuery }>,
    reply: FastifyReply
  ): Promise<void> => {
    const cashFlow = await this.service.getCashFlow(request.query);
    const parsedCashFlow = AnalyticsCashFlowSchema.parse(cashFlow);
    reply.code(200).sendSuccess(parsedCashFlow);
  };

  public getMonthlyIncomeExpense = async (
    request: FastifyRequest<{ Querystring: AnalyticsQuery }>,
    reply: FastifyReply
  ): Promise<void> => {
    const monthlyIncomeExpense = await this.service.getMonthlyIncomeExpense(request.query);
    const parsedMonthlyIncomeExpense = AnalyticsChartSchema.parse(monthlyIncomeExpense);
    reply.code(200).sendSuccess(parsedMonthlyIncomeExpense);
  };

  public getExpensesByCategory = async (
    request: FastifyRequest<{ Querystring: AnalyticsQuery }>,
    reply: FastifyReply
  ): Promise<void> => {
    const expensesByCategory = await this.service.getExpensesByCategory(request.query);
    const parsedExpensesByCategory = AnalyticsChartSchema.parse(expensesByCategory);
    reply.code(200).sendSuccess(parsedExpensesByCategory);
  };
}
