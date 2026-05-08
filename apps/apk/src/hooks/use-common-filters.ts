import { commonFiltersKeyMap } from "@/lib/nuqs";
import { useQueryStates } from "nuqs";

export const useCommonFilters = () => useQueryStates(commonFiltersKeyMap);
