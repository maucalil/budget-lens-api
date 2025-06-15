import { Prisma, PrismaClient, TransactionType } from '@prisma/client';
import { AnalyticsQuery, AnalyticsCashFlow, AnalyticsChart } from './analytics.schema';
import { Decimal } from '@prisma/client/runtime/library';
import { getDateRange } from '@utils/date';

type TransactionMonthlyAggreagation = {
  month: number;
  type: TransactionType;
  total: Decimal;
};

type CategoryExpenses = {
  categoryName: string;
  categoryColor: string;
  total: Decimal;
};

export class AnalyticsService {
  constructor(private prisma: PrismaClient) {}

  public async getCashFlow(query: AnalyticsQuery, userId: number): Promise<AnalyticsCashFlow> {
    const { month, year } = query;
    const { startDate, endDate } = getDateRange(year, month);

    const result = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: {
        account: { userId },
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
      const amount = new Decimal(group._sum.amount ?? 0);

      if (group.type === TransactionType.INCOME) {
        income = income.add(amount);
      } else if (group.type === TransactionType.EXPENSE) {
        expense = expense.add(amount);
      }
    }

    const balance = income.minus(expense);

    return { income, expense, balance };
  }

  public async getMonthlyIncomeExpense(query: AnalyticsQuery, userId: number): Promise<AnalyticsChart> {
    const { month, year } = query;

    const result = await this.prisma.$queryRaw<TransactionMonthlyAggreagation[]>(
      Prisma.sql`
        SELECT 
          EXTRACT(MONTH FROM t."date") AS month,
          t."type" AS type,
          SUM(t."amount")::float AS total
        FROM "Transaction" t
        JOIN "Account" a ON a.id = t."accountId"
        WHERE a."userId" = ${userId}
          AND EXTRACT(YEAR FROM t."date") = ${year}
          AND EXTRACT(MONTH FROM t."date") <= ${month}
        GROUP BY month, type
        ORDER BY month ASC
      `,
      year,
      month
    );

    return this.buildMonthlyIncomeExpenseChartData(result, year);
  }

  public async getExpensesByCategory(query: AnalyticsQuery, userId: number): Promise<AnalyticsChart> {
    const { month, year } = query;

    const result = await this.prisma.$queryRaw<CategoryExpenses[]>(
      Prisma.sql`
        SELECT
          c.name AS "categoryName",
          c.color AS "categoryColor",
          SUM(t."amount") AS total
        FROM "Transaction" t
        JOIN "Category" c ON c.id = t."categoryId"
        JOIN "Account" a ON a.id = t."accountId"
        WHERE a."userId" = ${userId}
          AND t."type" = 'EXPENSE'
          AND EXTRACT(YEAR FROM t."date") = ${year}
          AND EXTRACT(MONTH FROM t."date") = ${month}
        GROUP BY c.name, c.color
      `,
      year,
      month
    );

    return this.buildExpensesByCategoryChartData(result);
  }

  private buildMonthlyIncomeExpenseChartData(result: TransactionMonthlyAggreagation[], year: number): AnalyticsChart {
    const labels: string[] = [];
    const incomeData: Decimal[] = [];
    const expenseData: Decimal[] = [];
    const monthMap = new Map<number, { income: Decimal; expense: Decimal }>();

    for (const row of result) {
      const month = Number(row.month);
      const total = new Decimal(row.total);

      const monthData = monthMap.get(month) ?? {
        income: new Decimal(0),
        expense: new Decimal(0),
      };

      if (row.type === TransactionType.INCOME) {
        monthData.income = monthData.income.add(total);
      } else {
        monthData.expense = monthData.expense.add(total);
      }

      monthMap.set(month, monthData);
    }

    for (const month of monthMap.keys()) {
      labels.push(new Date(year, month - 1).toLocaleString('default', { month: 'short' }));

      const { income, expense } = monthMap.get(month)!;

      incomeData.push(income);
      expenseData.push(expense);
    }

    return {
      labels,
      datasets: [
        { label: 'Income', data: incomeData },
        { label: 'Expense', data: expenseData },
      ],
    };
  }

  private buildExpensesByCategoryChartData(result: CategoryExpenses[]): AnalyticsChart {
    const labels: string[] = [];
    const data: Decimal[] = [];
    const backgroundColor: string[] = [];

    for (const row of result) {
      const total = new Decimal(row.total);
      labels.push(row.categoryName);
      backgroundColor.push(row.categoryColor);
      data.push(total);
    }

    return {
      labels,
      datasets: [{ data, backgroundColor }],
    };
  }
}
