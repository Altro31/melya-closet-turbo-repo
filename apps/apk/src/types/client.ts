import { factory } from "@/lib/zod";
import z from "zod";

export const ClientSchema = factory.makeModelSchema("Client");
export type Client = z.infer<typeof ClientSchema>;

export const CreateClientSchema = z
  .object(factory.makeModelCreateSchema("Client").shape)
  .omit({ createdAt: true, updatedAt: true });
export type CreateClient = z.infer<typeof CreateClientSchema>;

export const UpdateClientSchema = z
  .object(factory.makeModelUpdateSchema("Client").shape)
  .omit({ id: true, createdAt: true, updatedAt: true });
export type UpdateClient = z.infer<typeof UpdateClientSchema>;
