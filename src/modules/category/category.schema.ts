import { CATEGORY_ERRORS } from '@utils/constants/errors';
import { CATEGORY_LIMITS } from '@utils/constants/limits';
import { z } from 'zod/v4';

const CategoryCore = {
  name: z.string().max(CATEGORY_LIMITS.NAME_MAX_LENGTH, CATEGORY_ERRORS.NAME_MAX_LENGTH),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
};

const CategorySchema = z.object(CategoryCore);
export const GetCategoriesResSchema = z.array(CategorySchema);

export type GetCategoriesRes = z.infer<typeof GetCategoriesResSchema>;

z.globalRegistry.add(GetCategoriesResSchema, { id: 'GetCategoriesResSchema' });
