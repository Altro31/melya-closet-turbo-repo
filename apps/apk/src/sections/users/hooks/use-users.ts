import { userCollection } from "@/lib/collections";
import type { UsersFilters } from "@/sections/users/hooks/use-users-filters";
import { ilike, or, useLiveQuery } from "@tanstack/react-db";

export function useUsers(filters?: UsersFilters) {
  return useLiveQuery(
    (q) =>
      q
        .from({ user: userCollection })
        .where(({ user }) =>
          or(
            ilike(user.name, `%${filters?.search ?? ""}%`),
            ilike(user.email, `%${filters?.search ?? ""}%`),
            ilike(user.phone, `%${filters?.search ?? ""}%`)
          )
        )
        .orderBy(({ user }) => user.updatedAt, "desc"),
    [filters?.search]
  );
}
