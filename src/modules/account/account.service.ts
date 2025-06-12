import { Account, Prisma, PrismaClient } from '@prisma/client';
import { AccountCreateInput, AccountUpdateInput } from './account.schema';

export class AccountService {
  constructor(private prisma: PrismaClient) {}

  public async getAccounts(): Promise<Account[]> {
    return this.prisma.account.findMany();
  }

  public async getAccountById(id: number): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      throw new Error('Account not found.');
    }

    return account;
  }

  public async createAccount(data: AccountCreateInput): Promise<Account> {
    return this.prisma.account.create({ data });
  }

  public async updateAccount(id: number, data: AccountUpdateInput): Promise<Account> {
    try {
      return await this.prisma.account.update({
        where: { id },
        data,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new Error('Account to update not found.');
      }
      throw err;
    }
  }

  public async deleteAccount(id: number): Promise<Account> {
    try {
      return await this.prisma.account.delete({
        where: { id },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new Error('Account to delete not found.');
      }
      throw err;
    }
  }
}
