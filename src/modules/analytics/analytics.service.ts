import { PrismaClient } from '@prisma/client';
import { AnalyticsCashFlowReqSchema, AnalyticsCashFlowResSchema } from './analytics.schema';
import { Decimal } from '@prisma/client/runtime/library';

export class AnalyticsService {
  constructor(private prisma: PrismaClient) {}

  public async getAnalyticsCashFlow(dateFilter: AnalyticsCashFlowReqSchema): Promise<AnalyticsCashFlowResSchema> {
    const { month, year } = dateFilter;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const result = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    let income: Decimal = new Decimal(0);
    let expense: Decimal = new Decimal(0);
    for (const group of result) {
      if (group.type === 'INCOME') income = group._sum.amount ?? new Decimal(0);
      else if (group.type === 'EXPENSE') expense = group._sum.amount ?? new Decimal(0);
    }

    const balance = income.minus(expense);

    return { income, expense, balance };
  }
}
