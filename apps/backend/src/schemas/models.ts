import { factory } from "#zod.ts";
import z from "zod";

export const CreateBaleSchema = z
  .object(factory.makeModelCreateSchema("Bale").shape)
  .omit({ createdAt: true, updatedAt: true });

export const UpdateBaleSchema = z
  .object(factory.makeModelUpdateSchema("Bale").shape)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const CreateBaleCategorySchema = z
  .object(factory.makeModelCreateSchema("Category").shape)
  .omit({ createdAt: true, updatedAt: true });

export const UpdateBaleCategorySchema = z
  .object(factory.makeModelUpdateSchema("Category").shape)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const CreateClientSchema = z
  .object(factory.makeModelCreateSchema("Client").shape)
  .omit({ createdAt: true, updatedAt: true });

export const UpdateClientSchema = z
  .object(factory.makeModelUpdateSchema("Client").shape)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const CreateOrderSchema = z
  .object(factory.makeModelCreateSchema("Order").shape)
  .omit({ createdAt: true, updatedAt: true });

export const UpdateOrderSchema = z
  .object(factory.makeModelUpdateSchema("Order").shape)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const CreateProductSchema = z
  .object(factory.makeModelCreateSchema("Product").shape)
  .omit({ createdAt: true, updatedAt: true });

export const UpdateProductSchema = z
  .object(factory.makeModelUpdateSchema("Product").shape)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const CreateUserSchema = z
  .object(factory.makeModelCreateSchema("User").shape)
  .omit({ createdAt: true, updatedAt: true });

export const UpdateUserSchema = z
  .object(factory.makeModelUpdateSchema("User").shape)
  .omit({ id: true, createdAt: true, updatedAt: true });