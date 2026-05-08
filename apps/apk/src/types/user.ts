import { factory } from "@/lib/zod";
import z from "zod";

export const UserSchema = factory.makeModelSchema("User");
export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = z
  .object(factory.makeModelCreateSchema("User").shape)
  .omit({ createdAt: true, updatedAt: true });
export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z
  .object(factory.makeModelUpdateSchema("User").shape)
  .omit({ id: true, createdAt: true, updatedAt: true });
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
