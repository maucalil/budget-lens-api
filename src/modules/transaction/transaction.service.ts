import { Transaction, PrismaClient, Prisma } from '@prisma/client';
import {
  TransactionCreateInput,
  TransactionFilter,
  TransactionUpdateInput,
} from './transaction.schema';
import { NotFoundError } from '@utils/errors';
import { TRANSACTION_FILTER_LIMITS } from '@utils/index';

export class TransactionService {
  constructor(private prisma: PrismaClient) {}

  public async createTransaction(
    data: TransactionCreateInput
  ): Promise<Transaction> {
    return this.prisma.transaction.create({ data });
  }

  public async getTransactions(
    filters?: TransactionFilter
  ): Promise<Transaction[]> {
    const { month, year, maxResults } = filters || {};
    const { startDate, endDate } = this.getDateRange(month, year);
    const where: Prisma.TransactionWhereInput = {};

    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    return this.prisma.transaction.findMany({
      take: maxResults,
      where,
      orderBy: { date: 'desc' },
    });
  }

  public async getTransactionById(id: number): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundError('Transaction not found.');
    }

    return transaction;
  }

  public async updateTransaction(
    id: number,
    data: TransactionUpdateInput
  ): Promise<Transaction> {
    try {
      return await this.prisma.transaction.update({
        where: { id },
        data,
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundError('Transaction to update not found.');
      }
      throw err;
    }
  }

  public async deleteTransaction(id: number): Promise<Transaction> {
    try {
      return await this.prisma.transaction.delete({
        where: { id },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundError('Transaction to delete not found.');
      }
      throw err;
    }
  }

  private getDateRange(
    month?: number,
    year?: number
  ): { startDate?: Date; endDate?: Date } {
    const getStartDate = (y: number, m: number): Date => new Date(y, m - 1, 1);
    const getEndDate = (y: number, m: number): Date => new Date(y, m, 0);

    if (month && year) {
      return {
        startDate: getStartDate(year, month),
        endDate: getEndDate(year, month),
      };
    } else if (year) {
      return {
        startDate: getStartDate(year, TRANSACTION_FILTER_LIMITS.MONTH_MIN),
        endDate: getEndDate(year, TRANSACTION_FILTER_LIMITS.MONTH_MAX),
      };
    }
    return {};
  }
}
