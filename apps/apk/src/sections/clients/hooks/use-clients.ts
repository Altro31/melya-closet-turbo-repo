import { clientCollection } from "@/lib/collections";
import type { ClientsFilters } from "@/sections/clients/hooks/use-clients-filters";
import { ilike, isUndefined, or, useLiveQuery } from "@tanstack/react-db";

export function useClients(filters?: ClientsFilters) {
  return useLiveQuery(
    (q) =>
      q
        .from({ client: clientCollection })
        .where(({ client }) =>
          or(
            ilike(client.name, `%${filters?.search ?? ""}%`),
            ilike(client.phone, `%${filters?.search ?? ""}%`),
            ilike(client.address, `%${filters?.search ?? ""}%`),
            ilike(client.details, `%${filters?.search ?? ""}%`)
          )
        )
        .where(() => isUndefined(void 0))
        .orderBy(({ client }) => client.updatedAt, "desc"),
    [filters?.search]
  );
}
