import { Transaction, PrismaClient, Prisma, TransactionType } from '@prisma/client';
import { TransactionCreateInput, TransactionFilter, TransactionUpdateInput } from './transaction.schema';
import { NotFoundError } from '@utils/errors';
import { Decimal } from '@prisma/client/runtime/library';
import { getDateRange } from '@utils/date';
import { WithUser } from '@utils/types';

export class TransactionService {
  private readonly defaultInclude = {
    account: {
      omit: { userId: true },
    },
    category: true,
  };

  constructor(private prisma: PrismaClient) {}

  public async getTransactions(userId: number, filters?: TransactionFilter): Promise<Transaction[]> {
    const { month, year, maxResults } = filters || {};
    const where: Prisma.TransactionWhereInput = {
      account: { userId },
    };

    if (year) {
      const { startDate, endDate } = getDateRange(year, month);
      where.date = { gte: startDate, lte: endDate };
    }

    return this.prisma.transaction.findMany({
      take: maxResults,
      where,
      orderBy: { date: 'desc' },
      include: this.defaultInclude,
    });
  }

  public async getTransactionById(id: number, userId: number): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id,
        account: { userId },
      },
      include: this.defaultInclude,
    });

    if (!transaction) {
      throw new NotFoundError('Transaction not found.');
    }

    return transaction;
  }

  public async createTransaction(data: WithUser<TransactionCreateInput>): Promise<Transaction> {
    return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const { accountId, userId, categoryId, ...createData } = data;
      const createdTransaction = await tx.transaction.create({
        data: {
          ...createData,
          account: { connect: { id: accountId, userId } },
          category: { connect: { id: categoryId } },
        },
        include: this.defaultInclude,
      });

      await this.updateAccountBalance(tx, createdTransaction.accountId, this.getSignedAmount(createdTransaction));

      return createdTransaction;
    });
  }

  public async updateTransaction(id: number, data: WithUser<TransactionUpdateInput>): Promise<Transaction> {
    return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const { accountId, userId, categoryId, ...updateData } = data;
      const oldTransaction = await tx.transaction.findUnique({
        where: {
          id,
          account: { userId },
        },
      });
      if (!oldTransaction) throw new NotFoundError('Transaction to update not found.');

      const updatePayload: Prisma.TransactionUpdateInput = { ...updateData };

      if (accountId) {
        updatePayload.account = { connect: { id: accountId, userId } };
      }

      if (categoryId) {
        updatePayload.category = { connect: { id: categoryId } };
      }

      const updatedTransaction = await tx.transaction.update({
        where: { id },
        data: updatePayload,
        include: this.defaultInclude,
      });

      const oldAmount = this.getSignedAmount(oldTransaction);
      const newAmount = this.getSignedAmount(updatedTransaction);
      const amountDelta = newAmount.minus(oldAmount);

      const accountUpdates = [];

      if (updatedTransaction.accountId !== oldTransaction.accountId) {
        accountUpdates.push(this.updateAccountBalance(tx, oldTransaction.accountId, oldAmount.negated()));
      }
      accountUpdates.push(this.updateAccountBalance(tx, updatedTransaction.accountId, amountDelta));

      await Promise.all(accountUpdates);

      return updatedTransaction;
    });
  }

  public async deleteTransaction(id: number, userId: number): Promise<Transaction> {
    return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const deletedTransaction = await tx.transaction.delete({
        where: {
          id,
          account: { userId },
        },
      });

      await this.updateAccountBalance(
        tx,
        deletedTransaction.accountId,
        this.getSignedAmount(deletedTransaction).negated()
      );

      return deletedTransaction;
    });
  }

  private getSignedAmount(transaction: Pick<Transaction, 'amount' | 'type'>): Decimal {
    return transaction.type === TransactionType.INCOME ? transaction.amount : transaction.amount.negated();
  }

  private async updateAccountBalance(
    tx: Prisma.TransactionClient,
    accountId: number,
    amountDelta: Prisma.Decimal
  ): Promise<void> {
    await tx.account.update({
      where: { id: accountId },
      data: { amount: { increment: amountDelta } },
    });
  }
}
