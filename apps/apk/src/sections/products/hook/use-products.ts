import { baleCollection } from "@/lib/collections";
import { productCollection } from "@/lib/collections";
import type { ProductsFilters } from "@/sections/products/hook/use-products-filters";
import {
  eq,
  gte,
  ilike,
  inArray,
  isUndefined,
  lte,
  or,
  useLiveQuery,
} from "@tanstack/react-db";

export function useProducts(filters?: ProductsFilters) {
  return useLiveQuery(
    (q) =>
      q
        .from({ product: productCollection })
        .where(({ product }) =>
          or(
            ilike(product.name, `%${filters?.search ?? ""}%`),
            ilike(product.description, `%${filters?.search ?? ""}%`)
          )
        )
        .where(({ product }) =>
          filters?.size
            ? inArray(filters.size, product.sizes)
            : isUndefined(void 0)
        )
        .where(({ product }) =>
          typeof filters?.minPrice === "number"
            ? gte(product.price, filters.minPrice)
            : isUndefined(void 0)
        )
        .where(({ product }) =>
          typeof filters?.maxPrice === "number"
            ? lte(product.price, filters.maxPrice)
            : isUndefined(void 0)
        )
        .where(({ product }) =>
          typeof filters?.minQuantity === "number"
            ? gte(product.currentCount, filters.minQuantity)
            : isUndefined(void 0)
        )
        .where(({ product }) =>
          typeof filters?.maxQuantity === "number"
            ? lte(product.currentCount, filters.maxQuantity)
            : isUndefined(void 0)
        )
        .join({ bale: baleCollection }, ({ bale, product }) =>
          eq(product.baleId, bale.id)
        )
        .where(({ bale }) =>
          filters?.bale ? eq(bale.id, filters.bale) : isUndefined(void 0)
        )
        .select(({ bale, product }) => ({ ...product, Bale: bale })),
    [
      filters?.bale,
      filters?.maxPrice,
      filters?.maxQuantity,
      filters?.minPrice,
      filters?.minQuantity,
      filters?.search,
      filters?.size,
    ]
  );
}

export function useBales() {
  return useLiveQuery((q) =>
    q
      .from({ bale: baleCollection })
      .orderBy(({ bale }) => bale.name, "asc")
      .select(({ bale }) => ({ id: bale.id, name: bale.name }))
  );
}
