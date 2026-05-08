import { baleCategoryCollection } from "@/lib/collections";
import {
  ilike,
  useLiveInfiniteQuery,
  useLiveSuspenseQuery,
} from "@tanstack/react-db";

interface Filters {
  search?: string;
}

export function useSelectCategories(filters?: Filters) {
  return useLiveInfiniteQuery(
    (q) =>
      q
        .from({ category: baleCategoryCollection })
        .where((r) => ilike(r.category.name, `%${filters?.search ?? ""}%`))
        .select(({ category: { id, name } }) => ({ id, name }))
        .orderBy((c) => c.$selected.name),
    { pageSize: 35 },
    [filters?.search]
  );
}
