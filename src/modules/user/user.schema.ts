import { USER_LIMITS } from '@utils/constants/limits';
import { z } from 'zod/v4';

const UserLogin = {
  email: z.email(),
  password: z.string().min(USER_LIMITS.PASSWORD_MIN_LENGTH),
};

const UserInput = {
  ...UserLogin,
  name: z.string().min(USER_LIMITS.NAME_MIN_LENGTH).max(USER_LIMITS.NAME_MAX_LENGTH),
};

const UserGenerated = {
  id: z.number(),
};

export const UserCreateSchema = z.object(UserInput);
export const UserLoginSchema = z.object(UserLogin);

export const UserResSchema = z
  .object({
    ...UserGenerated,
    ...UserInput,
  })
  .omit({ password: true });

export type UserCreateInput = z.infer<typeof UserCreateSchema>;
export type UserLoginInput = z.infer<typeof UserLoginSchema>;

z.globalRegistry.add(UserCreateSchema, { id: 'UserCreateSchema' });
z.globalRegistry.add(UserLoginSchema, { id: 'UserLoginSchema' });
z.globalRegistry.add(UserResSchema, { id: 'UserResSchema' });
