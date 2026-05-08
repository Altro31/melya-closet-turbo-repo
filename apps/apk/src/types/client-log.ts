import { factory } from "@/lib/zod";
import z from "zod";

export const ClientLogSchema = factory.makeModelSchema("ClientLog");
export type ClientLog = z.infer<typeof ClientLogSchema>;

export const CreateClientLogSchema = z
  .object(factory.makeModelCreateSchema("ClientLog").shape)
  .omit({ id: true, createdAt: true, updatedAt: true });
export type CreateClientLog = z.infer<typeof CreateClientLogSchema>;

export const UpdateClientLogSchema = z
  .object(factory.makeModelUpdateSchema("ClientLog").shape)
  .omit({ id: true, createdAt: true, updatedAt: true });
export type UpdateClientLog = z.infer<typeof UpdateClientLogSchema>;
