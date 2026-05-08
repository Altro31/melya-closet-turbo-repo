import { factory } from "@/lib/zod";
import z from "zod";

export const UserLogSchema = factory.makeModelSchema("UserLog");
export type UserLog = z.infer<typeof UserLogSchema>;

export const CreateUserLogSchema = z
  .object(factory.makeModelCreateSchema("UserLog").shape)
  .omit({ id: true, createdAt: true, updatedAt: true });
export type CreateUserLog = z.infer<typeof CreateUserLogSchema>;

export const UpdateUserLogSchema = z
  .object(factory.makeModelUpdateSchema("UserLog").shape)
  .omit({ id: true, createdAt: true, updatedAt: true });
export type UpdateUserLog = z.infer<typeof UpdateUserLogSchema>;
