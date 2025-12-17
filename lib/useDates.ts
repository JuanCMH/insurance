import { getYear, getMonth } from "date-fns";
import { parseAsString, useQueryStates } from "nuqs";

export const useDates = () => {
  const defaultYear = getYear(new Date());
  const defaultMonth = getMonth(new Date()) + 1;

  return useQueryStates({
    selectedYear: parseAsString.withDefault(String(defaultYear)),
    selectedMonth: parseAsString.withDefault(String(defaultMonth)),
  });
};
