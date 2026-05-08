import { parseAsString, useQueryStates, type inferParserType } from "nuqs";

const filters = {
  search: parseAsString.withDefault(""),
};

export type ClientsFilters = inferParserType<typeof filters>;

export function useClientsFilters() {
  return useQueryStates(filters);
}

