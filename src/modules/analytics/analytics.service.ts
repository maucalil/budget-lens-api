import { $Enums, PrismaClient } from '@prisma/client';
import { AnalyticsCashFlowQuery, AnalyticsCashFlowRes } from './analytics.schema';
import { Decimal } from '@prisma/client/runtime/library';
import { getDateRange } from '@utils/date';

export class AnalyticsService {
  constructor(private prisma: PrismaClient) {}

  public async getAnalyticsCashFlow(query: AnalyticsCashFlowQuery): Promise<AnalyticsCashFlowRes> {
    const { month, year } = query;
    const { startDate, endDate } = getDateRange(month, year);

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
      if (group.type === $Enums.TransactionType.INCOME) income = group._sum.amount ?? new Decimal(0);
      else if (group.type === $Enums.TransactionType.EXPENSE) expense = group._sum.amount ?? new Decimal(0);
    }

    const balance = income.minus(expense);

    return { income, expense, balance };
  }
}
