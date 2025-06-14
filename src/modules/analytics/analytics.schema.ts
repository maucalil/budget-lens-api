import { DATE_LIMITS } from '@utils/constants/limits';
import { zDecimal } from '@utils/zod';
import { z } from 'zod/v4';

export const AnalyticsQuerySchema = z
  .object({
    month: z.coerce.number().int().min(DATE_LIMITS.MONTH_MIN).max(DATE_LIMITS.MONTH_MAX),
    year: z.coerce.number().int().min(DATE_LIMITS.YEAR_MIN).max(DATE_LIMITS.YEAR_MAX),
  })
  .refine(data => data.month === undefined || data.year !== undefined, {
    message: 'Year is required if month is provided.',
    path: ['year'],
  });

export const AnalyticsCashFlowSchema = z.object({
  income: zDecimal,
  expense: zDecimal,
  balance: zDecimal,
});

export const AnalyticsChartSchema = z.object({
  labels: z.array(z.string()),
  datasets: z.array(
    z.object({
      data: z.array(zDecimal),
      label: z.string().optional(),
      backgroundColor: z.array(z.string()).optional(),
    })
  ),
});

export type AnalyticsQuery = z.infer<typeof AnalyticsQuerySchema>;
export type AnalyticsCashFlow = z.infer<typeof AnalyticsCashFlowSchema>;
export type AnalyticsChart = z.infer<typeof AnalyticsChartSchema>;

z.globalRegistry.add(AnalyticsQuerySchema, {
  id: 'AnalyticsQuerySchema',
});
z.globalRegistry.add(AnalyticsCashFlowSchema, {
  id: 'AnalyticsCashFlowSchema',
});
z.globalRegistry.add(AnalyticsChartSchema, {
  id: 'AnalyticsChartSchema',
});
