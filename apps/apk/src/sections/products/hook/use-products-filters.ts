import {
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  useQueryStates,
  type inferParserType,
} from "nuqs";

const filters = {
  search: parseAsString.withDefault(""),
  bale: parseAsString,
  size: parseAsString,
  minPrice: parseAsFloat,
  maxPrice: parseAsFloat,
  minQuantity: parseAsInteger,
  maxQuantity: parseAsInteger,
};

export type ProductsFilters = inferParserType<typeof filters>;

export function useProductsFilters() {
  return useQueryStates(filters);
}
