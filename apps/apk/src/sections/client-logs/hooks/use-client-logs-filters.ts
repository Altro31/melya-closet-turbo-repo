import { parseAsString, useQueryStates, type inferParserType } from "nuqs";

const filters = {
  search: parseAsString.withDefault(""),
};

export type ClientLogsFilters = inferParserType<typeof filters>;

export function useClientLogsFilters() {
  return useQueryStates(filters);
}

