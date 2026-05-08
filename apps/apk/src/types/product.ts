import { factory } from "@/lib/zod";
import z from "zod";

export const ProductSchema = factory.makeModelSchema("Product");
export type Product = z.infer<typeof ProductSchema>;

export const CreateProductSchema = z
  .object(factory.makeModelCreateSchema("Product").shape)
  .omit({ createdAt: true, updatedAt: true });
export type CreateProduct = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = z
  .object(factory.makeModelUpdateSchema("Product").shape)
  .omit({ id: true, createdAt: true, updatedAt: true });
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
