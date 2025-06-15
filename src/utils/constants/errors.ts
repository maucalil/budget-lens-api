import { ACCOUNT_LIMITS, CATEGORY_LIMITS, TRANSACTION_LIMITS } from './limits';

export const ACCOUNT_ERRORS = {
  NAME_MIN_LENGTH: `Account name must be at least ${ACCOUNT_LIMITS.NAME_MIN_LENGTH} characters long`,
  NAME_MAX_LENGTH: `Account name must be at most ${ACCOUNT_LIMITS.NAME_MAX_LENGTH} characters long`,
};

export const CATEGORY_ERRORS = {
  NAME_MAX_LENGTH: `Category name must be at most ${CATEGORY_LIMITS.NAME_MAX_LENGTH} characters long`,
};

export const TRANSACTION_ERRORS = {
  NAME_MIN_LENGTH: `Transaction name must be at least ${TRANSACTION_LIMITS.NAME_MIN_LENGTH} characters long`,
  NAME_MAX_LENGTH: `Transaction name must be at most ${TRANSACTION_LIMITS.NAME_MAX_LENGTH} characters long`,
};
