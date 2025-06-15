import { Account, PrismaClient } from '@prisma/client';
import { AccountCreateInput, AccountUpdateInput } from './account.schema';
import { NotFoundError } from '@utils/errors';
import { WithUser } from '@utils/types';

export class AccountService {
  constructor(private prisma: PrismaClient) {}

  public async getAccounts(userId: number): Promise<Account[]> {
    return this.prisma.account.findMany({ where: { userId } });
  }

  public async getAccountById(id: number, userId: number): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundError('Account not found.');
    }

    return account;
  }

  public async createAccount(data: WithUser<AccountCreateInput>): Promise<Account> {
    return this.prisma.account.create({ data });
  }

  public async updateAccount(id: number, data: WithUser<AccountUpdateInput>): Promise<Account> {
    const { userId, ...updateData } = data;
    return await this.prisma.account.update({
      where: { id, userId },
      data: updateData,
    });
  }

  public async deleteAccount(id: number, userId: number): Promise<Account> {
    return await this.prisma.account.delete({
      where: { id, userId },
    });
  }
}
