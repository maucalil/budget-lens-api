import { FastifyReply, FastifyRequest } from 'fastify';
import { TransactionService } from './transaction.service';
import {
  TransactionCreateInput,
  TransactionParams,
  TransactionRes,
  TransactionResSchema,
  TransactionsRes,
  TransactionsResSchema,
  TransactionUpdateInput,
} from './transaction.schema';

export class TransactionController {
  constructor(private service: TransactionService) {}

  public createTransaction = async (
    request: FastifyRequest<{ Body: TransactionCreateInput }>
  ): Promise<TransactionRes> => {
    const transaction = await this.service.createTransaction(request.body);
    return TransactionResSchema.parse(transaction);
  };

  public getTransactions = async (): Promise<TransactionsRes> => {
    const transactions = await this.service.getTransactions();
    return TransactionsResSchema.parse(transactions);
  };

  public getTransaction = async (
    request: FastifyRequest<{ Params: TransactionParams }>
  ): Promise<TransactionRes> => {
    const { id } = request.params;
    const transaction = await this.service.getTransactionById(id);
    return TransactionResSchema.parse(transaction);
  };

  public updateTransaction = async (
    request: FastifyRequest<{
      Params: TransactionParams;
      Body: TransactionUpdateInput;
    }>
  ): Promise<TransactionRes> => {
    const { id } = request.params;
    const transaction = await this.service.updateTransaction(id, request.body);
    return TransactionResSchema.parse(transaction);
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
