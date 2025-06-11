import { $Enums } from '@prisma/client';
import { z } from 'zod/v4';

export const TransactionTypeEnum = z.enum($Enums.TransactionType);
