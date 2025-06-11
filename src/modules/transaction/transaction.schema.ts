import { TRANSACTION_LIMITS } from '@utils/constants/limits';
import { PaymentMethodEnum } from '@utils/enums/payment-method';
import { TransactionTypeEnum } from '@utils/enums/transaction-type';
import { z } from 'zod/v4';
import { Decimal } from '@prisma/client/runtime/library';

const TransactionInput = {
  name: z
    .string()
    .min(TRANSACTION_LIMITS.NAME_MIN_LENGTH)
    .max(TRANSACTION_LIMITS.NAME_MAX_LENGTH),
  amount: z.preprocess(val => {
    if (typeof val === 'string' || typeof val === 'number') {
      return new Decimal(val);
    }
    return val;
  }, z.instanceof(Decimal)),

  date: z.preprocess(val => {
    if (typeof val === 'string' || val instanceof Date) {
      return new Date(val);
    }
    return val;
  }, z.date()),
  type: TransactionTypeEnum,
  paymentMethod: PaymentMethodEnum,
  accountId: z.number(),
  categoryId: z.number(),
  // account: ConnectByIdSchema,
  // category: ConnectByIdSchema,
};

const TransactionGenerated = {
  id: z.number(),
};

export const TransactionParamsSchema = z.object({
  id: z.coerce.number(),
});

export const TransactionCreateSchema = z.object(TransactionInput);
export const TransactionUpdateSchema = z.object(TransactionInput).partial();

export const TransactionResSchema = z.object({
  ...TransactionGenerated,
  ...TransactionInput,
});
export const TransactionsResSchema = z.array(TransactionResSchema);

export type TransactionParams = z.infer<typeof TransactionParamsSchema>;
export type TransactionCreateInput = z.infer<typeof TransactionCreateSchema>;
export type TransactionUpdateInput = z.infer<typeof TransactionUpdateSchema>;
export type TransactionRes = z.infer<typeof TransactionResSchema>;
export type TransactionsRes = z.infer<typeof TransactionsResSchema>;

z.globalRegistry.add(TransactionCreateSchema, {
  id: 'TransactionCreateSchema',
});
z.globalRegistry.add(TransactionUpdateSchema, {
  id: 'TransactionUpdateSchema',
});
z.globalRegistry.add(TransactionResSchema, { id: 'TransactionResSchema' });
z.globalRegistry.add(TransactionsResSchema, { id: 'TransactionsResSchema' });
