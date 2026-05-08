import { useCommonFilters } from "@/hooks/use-common-filters";
import {
  useLiveQuery,
  type Context,
  type InitialQueryBuilder,
  type QueryBuilder,
} from "@tanstack/react-db";

export function useExtendedLiveQuery<TContext extends Context>(
  queryFn: (q: InitialQueryBuilder) => QueryBuilder<TContext>,
  accessorKey: TContext["fromSourceName"],
  deps?: Array<unknown>
) {
  const [filters] = useCommonFilters();
  return useLiveQuery(
    (q) =>
      queryFn(q)
        .orderBy(
          (ref) =>
            filters?.sort
              ? ref[accessorKey][
                  filters.sort[0].id as keyof (typeof ref)[typeof accessorKey]
                ]
              : (ref[accessorKey] as any).updatedAt,
          filters?.sort ? (filters?.sort[0].desc ? "desc" : "asc") : "asc"
        )
        .limit(filters?.pageSize ?? 10)
        .offset((filters?.page ?? 0) * (filters?.pageSize ?? 10)),
    [
      filters?.search,
      filters?.sort?.[0]?.id,
      filters?.sort?.[0]?.desc,
      filters?.pageSize,
      filters?.page,
      ...(deps ?? []),
    ]
  );
}
