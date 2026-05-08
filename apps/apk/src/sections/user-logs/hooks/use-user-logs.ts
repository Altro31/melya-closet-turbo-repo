import { userCollection } from "@/lib/collections";
import { userLogCollection } from "@/lib/collections";
import type { UserLogsFilters } from "@/sections/user-logs/hooks/use-user-logs-filters";
import { eq, ilike, or, useLiveQuery } from "@tanstack/react-db";

export function useUserLogs(filters?: UserLogsFilters) {
  return useLiveQuery(
    (q) =>
      q
        .from({ userLog: userLogCollection })
        .join({ user: userCollection }, ({ user, userLog }) =>
          eq(userLog.userId, user.id)
        )
        .where(({ userLog, user }) =>
          or(
            ilike(userLog.action, `%${filters?.search ?? ""}%`),
            ilike(userLog.details, `%${filters?.search ?? ""}%`),
            ilike(user.name, `%${filters?.search ?? ""}%`)
          )
        )
        .select(({ user, userLog }) => ({ ...userLog, User: user }))
        .orderBy(({ userLog }) => userLog.createdAt, "desc"),
    [filters?.search]
  );
}
