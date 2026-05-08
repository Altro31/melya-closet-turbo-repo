import { baleCategoryCollection } from "@/lib/collections";
import { count, useLiveQuery } from "@tanstack/react-db";

export const useBaleCategoriesStats = () =>
  useLiveQuery((q) =>
    q
      .from({ category: baleCategoryCollection })
      .select(({ category }) => ({ totalRecords: count(category) }))
      .findOne()
  );
