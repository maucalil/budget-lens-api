import { AccountService } from './account.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  AccountCreateInput,
  AccountParams,
  AccountResSchema,
  AccountsResSchema,
  AccountUpdateInput,
} from './account.schema';

export class AccountController {
  constructor(private service: AccountService) {}

  public getAccounts = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const accounts = await this.service.getAccounts(request.user.id);
    const parsedAccounts = AccountsResSchema.parse(accounts);
    reply.code(200).sendSuccess(parsedAccounts);
  };

  public getAccountById = async (
    request: FastifyRequest<{ Params: AccountParams }>,
    reply: FastifyReply
  ): Promise<void> => {
    const account = await this.service.getAccountById(request.params.id, request.user.id);
    const parsedAccount = AccountResSchema.parse(account);
    reply.code(200).sendSuccess(parsedAccount);
  };

  public createAccount = async (
    request: FastifyRequest<{ Body: AccountCreateInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const data = { ...request.body, userId: request.user.id };
    const account = await this.service.createAccount(data);
    const parsedAccount = AccountResSchema.parse(account);
    reply.code(201).sendSuccess(parsedAccount);
  };

  public updateAccount = async (
    request: FastifyRequest<{
      Params: AccountParams;
      Body: AccountUpdateInput;
    }>,
    reply: FastifyReply
  ): Promise<void> => {
    const data = { ...request.body, userId: request.user.id };
    const account = await this.service.updateAccount(request.params.id, data);
    const parsedAccount = AccountResSchema.parse(account);
    reply.code(200).sendSuccess(parsedAccount);
  };

  public deleteAccount = async (
    request: FastifyRequest<{ Params: AccountParams }>,
    reply: FastifyReply
  ): Promise<void> => {
    await this.service.deleteAccount(request.params.id, request.user.id);
    reply.status(200).send();
  };
}
