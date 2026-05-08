import { parseAsString, useQueryStates, type inferParserType } from "nuqs";

const filters = {
  search: parseAsString.withDefault(""),
};

export type UsersFilters = inferParserType<typeof filters>;

export function useUsersFilters() {
  return useQueryStates(filters);
}

