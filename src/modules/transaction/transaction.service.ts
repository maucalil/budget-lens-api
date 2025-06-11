import { Transaction, PrismaClient, Prisma } from '@prisma/client';
import {
  TransactionCreateInput,
  TransactionUpdateInput,
} from './transaction.schema';
import { NotFoundError } from '@utils/errors';

export class TransactionService {
  constructor(private prisma: PrismaClient) {}

  public async createTransaction(
    data: TransactionCreateInput
  ): Promise<Transaction> {
    return this.prisma.transaction.create({ data });
  }

  public async getTransactions(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany();
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
}
