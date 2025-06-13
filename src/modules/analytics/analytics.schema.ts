import { ANALYTICS_LIMITS } from '@utils/index';
import { zDecimal } from '@utils/zod';
import { z } from 'zod/v4';

export const AnalyticsCashFlowReqSchema = z
  .object({
    month: z.coerce.number().int().min(ANALYTICS_LIMITS.MONTH_MIN).max(ANALYTICS_LIMITS.MONTH_MAX),
    year: z.coerce.number().int().min(ANALYTICS_LIMITS.YEAR_MIN).max(ANALYTICS_LIMITS.YEAR_MAX),
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

export type AnalyticsCashFlowResSchema = z.infer<typeof AnalyticsCashFlowResSchema>;
export type AnalyticsCashFlowReqSchema = z.infer<typeof AnalyticsCashFlowReqSchema>;

z.globalRegistry.add(AnalyticsCashFlowReqSchema, {
  id: 'CashFlowReqSchema',
});
z.globalRegistry.add(AnalyticsCashFlowResSchema, {
  id: 'AnalyticsCashFlowResSchema',
});
