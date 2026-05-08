import { factory } from "@/lib/zod";
import z from "zod";

export const OrderSchema = factory.makeModelSchema("Order");
export type Order = z.infer<typeof OrderSchema>;

export const CreateOrderSchema = z
  .object(factory.makeModelCreateSchema("Order").shape)
  .omit({ createdAt: true, updatedAt: true });
export type CreateOrder = z.infer<typeof CreateOrderSchema>;

export const UpdateOrderSchema = z
  .object(factory.makeModelUpdateSchema("Order").shape)
  .omit({ id: true, createdAt: true, updatedAt: true });
export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;
