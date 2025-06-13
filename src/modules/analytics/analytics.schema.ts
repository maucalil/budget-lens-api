import { DATE_LIMITS } from '@utils/constants/limits';
import { zDecimal } from '@utils/zod';
import { z } from 'zod/v4';

export const AnalyticsCashFlowQuerySchema = z
  .object({
    month: z.coerce.number().int().min(DATE_LIMITS.MONTH_MIN).max(DATE_LIMITS.MONTH_MAX),
    year: z.coerce.number().int().min(DATE_LIMITS.YEAR_MIN).max(DATE_LIMITS.YEAR_MAX),
  })
  .refine(data => data.month === undefined || data.year !== undefined, {
    message: 'Year is required if month is provided.',
    path: ['year'],
  });

export const AnalyticsCashFlowResSchema = z.object({
  income: zDecimal,
  expense: zDecimal,
  balance: zDecimal,
});

export type AnalyticsCashFlowQuery = z.infer<typeof AnalyticsCashFlowQuerySchema>;
export type AnalyticsCashFlowRes = z.infer<typeof AnalyticsCashFlowResSchema>;

z.globalRegistry.add(AnalyticsCashFlowQuerySchema, {
  id: 'AnalyticsCashFlowQuerySchema',
});
z.globalRegistry.add(AnalyticsCashFlowResSchema, {
  id: 'AnalyticsCashFlowResSchema',
});
