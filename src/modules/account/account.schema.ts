import { ACCOUNT_LIMITS } from '@utils/constants/limits';
import { PaymentMethodEnum } from '@utils/enums/payment-method';
import { zDecimal } from '@utils/zod';
import { z } from 'zod/v4';

const AccountInput = {
  name: z.string().min(ACCOUNT_LIMITS.NAME_MIN_LENGTH).max(ACCOUNT_LIMITS.NAME_MAX_LENGTH),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  amount: zDecimal,
  paymentMethods: z.array(PaymentMethodEnum),
};

const AccountGenerated = {
  id: z.number(),
};

export const AccountParamsSchema = z.object({
  id: z.coerce.number(),
});

export const AccountCreateSchema = z.object(AccountInput);
export const AccountUpdateSchema = z.object(AccountInput).partial();
export const AccountResSchema = z.object({ ...AccountGenerated, ...AccountInput });
export const AccountsResSchema = z.array(AccountResSchema);

export type AccountParams = z.infer<typeof AccountParamsSchema>;
export type AccountCreateInput = z.infer<typeof AccountCreateSchema>;
export type AccountUpdateInput = z.infer<typeof AccountUpdateSchema>;

z.globalRegistry.add(AccountCreateSchema, { id: 'AccountCreateSchema' });
z.globalRegistry.add(AccountUpdateSchema, { id: 'AccountUpdateSchema' });
z.globalRegistry.add(AccountResSchema, { id: 'AccountResSchema' });
z.globalRegistry.add(AccountsResSchema, { id: 'AccountsResSchema' });
