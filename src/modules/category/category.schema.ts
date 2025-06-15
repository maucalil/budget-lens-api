import { CATEGORY_ERRORS } from '@utils/constants/errors';
import { CATEGORY_LIMITS } from '@utils/constants/limits';
import { z } from 'zod/v4';

const CategoryInput = {
  name: z.string().max(CATEGORY_LIMITS.NAME_MAX_LENGTH, CATEGORY_ERRORS.NAME_MAX_LENGTH),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
};

const CategoryGenerated = {
  id: z.number(),
};

export const CategoryResSchema = z.object({
  ...CategoryGenerated,
  ...CategoryInput,
});
export const CategoriesResSchema = z.array(CategoryResSchema);

z.globalRegistry.add(CategoriesResSchema, { id: 'CategoriesResSchema' });
