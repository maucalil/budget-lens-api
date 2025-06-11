import { z, ZodLiteral, ZodObject } from 'zod/v4';

export const ConnectByIdSchema = z.object({
  connect: z.object({
    id: z.number(),
  }),
});

export function createSuccessResponseSchema<T extends z.ZodType>(
  dataSchema: T
): ZodObject<{ success: ZodLiteral<true>; data: T }> {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
  });
}

export const ErrorIssueSchema = z.object({
  path: z
    .array(z.union([z.string(), z.number()]))
    .describe('The path to the invalid field.'),
  message: z.string(),
});

export const SimpleErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  issues: z
    .array(ErrorIssueSchema)
    .optional()
    .describe('Optional list of specific validation issues.'),
});
