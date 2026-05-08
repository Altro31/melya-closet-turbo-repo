import {
  createParser,
  parseAsIndex,
  parseAsInteger,
  parseAsString,
  type inferParserType,
} from "nuqs";
import type { SortingState } from "@tanstack/react-table";

function isSortingState(value: unknown): value is SortingState {
  return (
    Array.isArray(value) &&
    value.every(
      (entry) =>
        typeof entry === "object" &&
        entry !== null &&
        "id" in entry &&
        typeof entry.id === "string" &&
        "desc" in entry &&
        typeof entry.desc === "boolean"
    )
  );
}

const sortParser = createParser<SortingState>({
  parse(value) {
    const [id, order, ...rest] = value.split(",");

    if (id && (order === "asc" || order === "desc") && rest.length === 0) {
      return [{ id, desc: order === "desc" }];
    }

    try {
      const parsedValue = JSON.parse(value);

      return isSortingState(parsedValue) ? parsedValue : null;
    } catch {
      return null;
    }
  },
  serialize(value) {
    const [firstSort] = value;

    if (!firstSort) {
      return "";
    }

    return `${firstSort.id},${firstSort.desc ? "desc" : "asc"}`;
  },
});

export type CommonFilters = inferParserType<typeof commonFiltersKeyMap>;
export const commonFiltersKeyMap = {
  search: parseAsString.withDefault(""),
  sort: sortParser,
  page: parseAsIndex.withDefault(0),
  pageSize: parseAsInteger.withDefault(10),
};
