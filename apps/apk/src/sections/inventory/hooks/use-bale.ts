import { baleCollection } from "@/lib/collections";
import { baleCategoryCollection } from "@/lib/collections";
import { eq, useLiveQuery, useLiveSuspenseQuery } from "@tanstack/react-db";

export function useBale(id: string) {
  return useLiveQuery(
    (q) =>
      q
        .from({ bale: baleCollection })
        .where(({ bale }) => eq(bale.id, id))
        .select(({ bale }) => ({
          ...bale,
          Category: q
            .from({ category: baleCategoryCollection })
            .where(({ category }) => eq(bale.categoryId, category.id)),
        }))
        .findOne(),
    [id]
  );
}
