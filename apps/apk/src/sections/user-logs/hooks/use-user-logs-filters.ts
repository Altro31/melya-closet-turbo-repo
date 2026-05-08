import { parseAsString, useQueryStates, type inferParserType } from "nuqs";

const filters = {
  search: parseAsString.withDefault(""),
};

export type UserLogsFilters = inferParserType<typeof filters>;

export function useUserLogsFilters() {
  return useQueryStates(filters);
}

