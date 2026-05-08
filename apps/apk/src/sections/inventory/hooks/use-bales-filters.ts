import {
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
  useQueryStates,
  type inferParserType,
} from "nuqs";

const filters = {
  search: parseAsString.withDefault(""),
  dateFrom: parseAsIsoDateTime,
  dateTo: parseAsIsoDateTime,
  minPrice: parseAsFloat,
  maxPrice: parseAsFloat,
  minQuantity: parseAsInteger,
  maxQuantity: parseAsInteger,
};

export type BaleFilters = inferParserType<typeof filters>;
export function useBalesFilters() {
  return useQueryStates(filters);
}
