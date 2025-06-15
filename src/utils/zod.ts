import { z, ZodLiteral, ZodObject } from 'zod/v4';
import { Decimal } from '@prisma/client/runtime/library';

export const zDecimal = z.preprocess(val => {
  if (typeof val === 'string' || typeof val === 'number') {
    return new Decimal(val);
  }
  return val;
}, z.instanceof(Decimal));

export const zDate = z.preprocess(val => {
  if (typeof val === 'string' || val instanceof Date) {
    return new Date(val);
  }
  return val;
}, z.date());

export const ConnectByIdSchema = z.object({
  connect: z.object({
    id: z.number(),
  }),
});

export const ErrorIssueSchema = z.object({
  path: z.array(z.union([z.string(), z.number()])).describe('The path to the invalid field.'),
  message: z.string(),
});

export const SimpleErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  issues: z.array(ErrorIssueSchema).optional().describe('Optional list of specific validation issues.'),
});

export function createSuccessResponseSchema<T extends z.ZodType>(
  dataSchema: T
): ZodObject<{ success: ZodLiteral<true>; data: T }> {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
  });
}
