import { parseAsString, useQueryStates, type inferParserType } from "nuqs";

const filters = {
  search: parseAsString.withDefault(""),
  status: parseAsString.withDefault(""),
  orderType: parseAsString.withDefault(""),
  paymentMethod: parseAsString.withDefault(""),
  isActive: parseAsString.withDefault(""),
  dateFrom: parseAsString.withDefault(""),
  dateTo: parseAsString.withDefault(""),
  minAmount: parseAsString.withDefault(""),
  maxAmount: parseAsString.withDefault(""),
};

export type OrderFilters = inferParserType<typeof filters>;

export function useOrdersFilters() {
  return useQueryStates(filters);
}

