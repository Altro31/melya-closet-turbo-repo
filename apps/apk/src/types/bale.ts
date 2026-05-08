import { factory } from "@/lib/zod";
import z from "zod";

export const BaleSchema = factory.makeModelSchema("Bale");
export type Bale = z.infer<typeof BaleSchema>;

export const CreateBaleSchema = z
  .object(factory.makeModelCreateSchema("Bale").shape)
  .omit({ createdAt: true, updatedAt: true });
export type CreateBale = z.infer<typeof CreateBaleSchema>;

export const UpdateBaleSchema = z
  .object(factory.makeModelUpdateSchema("Bale").shape)
  .omit({ id: true, createdAt: true, updatedAt: true });
export type UpdateBale = z.infer<typeof UpdateBaleSchema>;
