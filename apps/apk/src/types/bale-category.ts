import { factory } from "@/lib/zod";
import z from "zod";

export const BaleCategorySchema = factory.makeModelSchema("Category");
export type BaleCategory = z.infer<typeof BaleCategorySchema>;

export const CreateBaleCategorySchema = z
  .object(factory.makeModelCreateSchema("Category").shape)
  .omit({ createdAt: true, updatedAt: true });
export type CreateBaleCategory = z.infer<typeof CreateBaleCategorySchema>;

export const UpdateBaleCategorySchema = z
  .object(factory.makeModelUpdateSchema("Category").shape)
  .omit({ id: true, createdAt: true, updatedAt: true });
export type UpdateBaleCategory = z.infer<typeof UpdateBaleCategorySchema>;
