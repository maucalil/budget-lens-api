import { FastifyReply, FastifyRequest } from 'fastify';
import { TransactionService } from './transaction.service';
import {
  TransactionCreateInput,
  TransactionFilter,
  TransactionParams,
  TransactionResSchema,
  TransactionsResSchema,
  TransactionUpdateInput,
} from './transaction.schema';

export class TransactionController {
  constructor(private service: TransactionService) {}

  public getTransactions = async (
    request: FastifyRequest<{ Querystring: TransactionFilter }>,
    reply: FastifyReply
  ): Promise<void> => {
    const transactions = await this.service.getTransactions(request.user.id, request.query);
    const parsedTransaction = TransactionsResSchema.parse(transactions);
    reply.code(200).sendSuccess(parsedTransaction);
  };

  public getTransaction = async (
    request: FastifyRequest<{ Params: TransactionParams }>,
    reply: FastifyReply
  ): Promise<void> => {
    const { id } = request.params;
    const transaction = await this.service.getTransactionById(id, request.user.id);
    const parsedTransaction = TransactionResSchema.parse(transaction);
    reply.code(200).sendSuccess(parsedTransaction);
  };

  public createTransaction = async (
    request: FastifyRequest<{ Body: TransactionCreateInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const data = { ...request.body, userId: request.user.id };
    const transaction = await this.service.createTransaction(data);
    const parsedTransaction = TransactionResSchema.parse(transaction);
    reply.code(201).sendSuccess(parsedTransaction);
  };

  public updateTransaction = async (
    request: FastifyRequest<{
      Params: TransactionParams;
      Body: TransactionUpdateInput;
    }>,
    reply: FastifyReply
  ): Promise<void> => {
    const { id } = request.params;
    const data = { ...request.body, userId: request.user.id };
    const transaction = await this.service.updateTransaction(id, data);
    const parsedTransaction = TransactionResSchema.parse(transaction);
    reply.code(200).sendSuccess(parsedTransaction);
  };

  public deleteTransaction = async (
    request: FastifyRequest<{ Params: TransactionParams }>,
    reply: FastifyReply
  ): Promise<void> => {
    const { id } = request.params;
    await this.service.deleteTransaction(id, request.user.id);
    reply.status(204).send();
  };
}
