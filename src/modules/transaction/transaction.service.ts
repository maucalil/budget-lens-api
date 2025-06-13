import { Transaction, PrismaClient, Prisma, $Enums } from '@prisma/client';
import { TransactionCreateInput, TransactionFilter, TransactionUpdateInput } from './transaction.schema';
import { NotFoundError } from '@utils/errors';
import { TRANSACTION_FILTER_LIMITS } from '@utils/index';
import { Decimal } from '@prisma/client/runtime/library';

export class TransactionService {
  constructor(private prisma: PrismaClient) {}

  public async createTransaction(data: TransactionCreateInput): Promise<Transaction> {
    return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const createdTransaction = await tx.transaction.create({ data });

      await tx.account.update({
        where: { id: createdTransaction.accountId },
        data: { amount: { increment: this.getSignedAmount(createdTransaction) } },
      });

      return createdTransaction;
    });
  }

  public async getTransactions(filters?: TransactionFilter): Promise<Transaction[]> {
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
    const transaction = await this.prisma.transaction.findUnique({ where: { id } });

    if (!transaction) {
      throw new NotFoundError('Transaction not found.');
    }

    return transaction;
  }

  public async updateTransaction(id: number, data: TransactionUpdateInput): Promise<Transaction> {
    return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const oldTransaction = await tx.transaction.findUnique({ where: { id } });
      if (!oldTransaction) throw new NotFoundError('Transaction to update not found.');

      const updatedTransaction = await tx.transaction.update({
        where: { id },
        data,
      });

      const oldAmount = this.getSignedAmount(oldTransaction);
      const newAmount = this.getSignedAmount(updatedTransaction);
      const amountDelta = newAmount.minus(oldAmount);

      const accountUpdates = [];

      if (updatedTransaction.accountId !== oldTransaction.accountId) {
        accountUpdates.push(
          tx.account.update({
            where: { id: oldTransaction.accountId },
            data: { amount: { increment: oldAmount.negated() } },
          })
        );
      }

      accountUpdates.push(
        tx.account.update({
          where: { id: updatedTransaction.accountId },
          data: { amount: { increment: amountDelta } },
        })
      );

      await Promise.all(accountUpdates);

      return updatedTransaction;
    });
  }

  public async deleteTransaction(id: number): Promise<Transaction> {
    return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const deletedTransaction = await tx.transaction.delete({ where: { id } });

      await tx.account.update({
        where: { id: deletedTransaction.accountId },
        data: { amount: { increment: this.getSignedAmount(deletedTransaction).negated() } },
      });

      return deletedTransaction;
    });
  }

  private getDateRange(month?: number, year?: number): { startDate?: Date; endDate?: Date } {
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

  private getSignedAmount(transaction: Pick<Transaction, 'amount' | 'type'>): Decimal {
    return transaction.type === $Enums.TransactionType.INCOME ? transaction.amount : transaction.amount.negated();
  }
}
