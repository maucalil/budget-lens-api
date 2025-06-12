import { FastifyReply, FastifyRequest } from 'fastify';
import { TransactionService } from './transaction.service';
import {
  TransactionCreateInput,
  TransactionFilterSchema,
  TransactionParams,
  TransactionResSchema,
  TransactionsResSchema,
  TransactionUpdateInput,
} from './transaction.schema';

export class TransactionController {
  constructor(private service: TransactionService) {}

  public getTransactions = async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> => {
    const filters = TransactionFilterSchema.parse(request.query);
    const transactions = await this.service.getTransactions(filters);
    const parsedTransaction = TransactionsResSchema.parse(transactions);
    reply.code(200).sendSuccess(parsedTransaction);
  };

  public getTransaction = async (
    request: FastifyRequest<{ Params: TransactionParams }>,
    reply: FastifyReply
  ): Promise<void> => {
    const { id } = request.params;
    const transaction = await this.service.getTransactionById(id);
    const parsedTransaction = TransactionResSchema.parse(transaction);
    reply.code(200).sendSuccess(parsedTransaction);
  };

  public createTransaction = async (
    request: FastifyRequest<{ Body: TransactionCreateInput }>,
    reply: FastifyReply
  ): Promise<void> => {
    const transaction = await this.service.createTransaction(request.body);
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
    const transaction = await this.service.updateTransaction(id, request.body);
    const parsedTransaction = TransactionResSchema.parse(transaction);
    reply.code(200).sendSuccess(parsedTransaction);
  };

  public deleteTransaction = async (
    request: FastifyRequest<{ Params: TransactionParams }>,
    reply: FastifyReply
  ): Promise<void> => {
    const { id } = request.params;
    await this.service.deleteTransaction(id);
    reply.status(204).send();
  };
}
