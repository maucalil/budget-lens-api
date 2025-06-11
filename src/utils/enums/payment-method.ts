import { $Enums } from '@prisma/client';
import { z } from 'zod/v4';

export const PaymentMethodEnum = z.enum($Enums.PaymentMethod);
