import { commonFiltersKeyMap, type CommonFilters } from "@/lib/nuqs";
import { useQueryStates } from "nuqs";

export type BaleCategoriesFilters = CommonFilters;

export function useBaleCategoriesFilters() {
  return useQueryStates(commonFiltersKeyMap);
}
