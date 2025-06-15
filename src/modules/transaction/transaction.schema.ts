import { DATE_LIMITS, TRANSACTION_FILTER_LIMITS, TRANSACTION_LIMITS } from '@utils/constants/limits';
import { PaymentMethodEnum } from '@utils/enums/payment-method';
import { TransactionTypeEnum } from '@utils/enums/transaction-type';
import { zDate, zDecimal } from '@utils/zod';
import { z } from 'zod/v4';

const TransactionInput = {
  name: z.string().min(TRANSACTION_LIMITS.NAME_MIN_LENGTH).max(TRANSACTION_LIMITS.NAME_MAX_LENGTH),
  amount: zDecimal,
  date: zDate,
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

export const TransactionFilterSchema = z
  .object({
    month: z.coerce.number().int().min(DATE_LIMITS.MONTH_MIN).max(DATE_LIMITS.MONTH_MAX).optional(),
    year: z.coerce.number().int().min(DATE_LIMITS.YEAR_MIN).max(DATE_LIMITS.YEAR_MAX).optional(),
    maxResults: z.coerce
      .number()
      .int()
      .min(TRANSACTION_FILTER_LIMITS.RESULTS_MIN)
      .max(TRANSACTION_FILTER_LIMITS.RESULTS_MAX)
      .optional(),
  })
  .refine(data => data.month === undefined || data.year !== undefined, {
    message: 'Year is required if month is provided.',
    path: ['year'],
  });

export const TransactionCreateSchema = z.object(TransactionInput);
export const TransactionUpdateSchema = z.object(TransactionInput).partial();

export const TransactionResSchema = z.object({
  ...TransactionGenerated,
  ...TransactionInput,
});
export const TransactionsResSchema = z.array(TransactionResSchema);

export type TransactionParams = z.infer<typeof TransactionParamsSchema>;
export type TransactionFilter = z.infer<typeof TransactionFilterSchema>;
export type TransactionCreateInput = z.infer<typeof TransactionCreateSchema>;
export type TransactionUpdateInput = z.infer<typeof TransactionUpdateSchema>;

z.globalRegistry.add(TransactionCreateSchema, {
  id: 'TransactionCreateSchema',
});
z.globalRegistry.add(TransactionUpdateSchema, {
  id: 'TransactionUpdateSchema',
});
z.globalRegistry.add(TransactionResSchema, { id: 'TransactionResSchema' });
z.globalRegistry.add(TransactionsResSchema, { id: 'TransactionsResSchema' });
z.globalRegistry.add(TransactionFilterSchema, {
  id: 'TransactionFilterSchema',
});
