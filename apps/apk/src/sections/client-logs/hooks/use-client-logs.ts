import { clientCollection } from "@/lib/collections";
import { clientLogCollection } from "@/lib/collections";
import type { ClientLogsFilters } from "@/sections/client-logs/hooks/use-client-logs-filters";
import { eq, ilike, or, useLiveQuery } from "@tanstack/react-db";

export function useClientLogs(filters?: ClientLogsFilters) {
  return useLiveQuery(
    (q) =>
      q
        .from({ clientLog: clientLogCollection })
        .join({ client: clientCollection }, ({ client, clientLog }) =>
          eq(clientLog.clientId, client.id)
        )
        .where(({ clientLog, client }) =>
          or(
            ilike(clientLog.action, `%${filters?.search ?? ""}%`),
            ilike(clientLog.details, `%${filters?.search ?? ""}%`),
            ilike(client.name, `%${filters?.search ?? ""}%`)
          )
        )
        .select(({ client, clientLog }) => ({ ...clientLog, Client: client }))
        .orderBy(({ clientLog }) => clientLog.createdAt, "desc"),
    [filters?.search]
  );
}
