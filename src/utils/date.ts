import { DATE_LIMITS } from './constants/limits';

export function getDateRange(year: number, month?: number): { startDate: Date; endDate: Date } {
  const getStartDate = (y: number, m: number): Date => new Date(y, m - 1, 1);
  const getEndDate = (y: number, m: number): Date => new Date(y, m, 0);

  if (month) {
    return {
      startDate: getStartDate(year, month),
      endDate: getEndDate(year, month),
    };
  }

  return {
    startDate: getStartDate(year, DATE_LIMITS.MONTH_MIN),
    endDate: getEndDate(year, DATE_LIMITS.MONTH_MAX),
  };
}
