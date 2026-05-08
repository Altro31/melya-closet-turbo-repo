import { baleCategoryCollection } from "@/lib/collections";
import { useExtendedLiveQuery } from "@/lib/query";
import type { BaleCategoriesFilters } from "@/sections/bale-categories/hooks/use-bale-categories-filters";
import { ilike, useLiveQuery } from "@tanstack/react-db";

export function useBaleCategories(filters?: BaleCategoriesFilters) {
  return useExtendedLiveQuery(
    (q) =>
      q
        .from({ category: baleCategoryCollection })
        .where(({ category }) =>
          ilike(category.name, `%${filters?.search ?? ""}%`)
        ),
    "category"
  );
}
