import { baleCollection } from "@/lib/collections";
import type { BaleFilters } from "@/sections/inventory/hooks/use-bales-filters";
import {
  gte,
  ilike,
  isUndefined,
  lte,
  or,
  useLiveQuery,
} from "@tanstack/react-db";

export function useBales(filters?: BaleFilters) {
  return useLiveQuery(
    (q) => {
      return q
        .from({ bale: baleCollection })
        .where(({ bale }) =>
          or(
            ilike(bale.name, `%${filters?.search ?? ""}%`),
            ilike(bale.description, `%${filters?.search ?? ""}%`)
          )
        )
        .where(({ bale }) =>
          filters?.dateFrom
            ? gte(bale.createdAt, filters.dateFrom)
            : isUndefined(void 0)
        )
        .where(({ bale }) =>
          filters?.dateFrom
            ? gte(bale.createdAt, filters.dateTo)
            : isUndefined(void 0)
        )
        .where(({ bale }) =>
          filters?.minPrice
            ? gte(bale.price, filters?.minPrice)
            : isUndefined(void 0)
        )
        .where(({ bale }) =>
          filters?.maxPrice
            ? lte(bale.price, filters?.maxPrice)
            : isUndefined(void 0)
        )
        .where(({ bale }) =>
          filters?.minQuantity
            ? gte(bale.currentTotal, filters?.minQuantity)
            : isUndefined(void 0)
        )
        .where(({ bale }) =>
          filters?.maxQuantity
            ? lte(bale.currentTotal, filters?.maxQuantity)
            : isUndefined(void 0)
        )
        .orderBy(({ bale }) => bale.updatedAt, "desc");
    },
    [
      filters?.dateFrom,
      filters?.dateTo,
      filters?.maxPrice,
      filters?.maxQuantity,
      filters?.minPrice,
      filters?.minQuantity,
      filters?.search,
    ]
  );
}
