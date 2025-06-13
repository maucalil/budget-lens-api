import { Account, PrismaClient } from '@prisma/client';
import { AccountCreateInput, AccountUpdateInput } from './account.schema';
import { NotFoundError } from '@utils/errors';

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
      throw new NotFoundError('Account not found.');
    }

    return account;
  }

  public async createAccount(data: AccountCreateInput): Promise<Account> {
    return this.prisma.account.create({ data });
  }

  public async updateAccount(id: number, data: AccountUpdateInput): Promise<Account> {
    return await this.prisma.account.update({
      where: { id },
      data,
    });
  }

  public async deleteAccount(id: number): Promise<Account> {
    return await this.prisma.account.delete({
      where: { id },
    });
  }
}
