import { Elysia } from "elysia";
import { db } from "../db";
import { CreateProductSchema, UpdateProductSchema } from "../schemas/models";
import { IdParamSchema } from "./common";

export const productModule = new Elysia({ prefix: "/api/products" })
  .post("/", ({ body }) =>
    db.product.create({
      data: body,
    }),
  {
    body: CreateProductSchema,
  })
  .patch("/:id", ({ params, body }) =>
    db.product.update({
      where: { id: params.id },
      data: body,
    }),
  {
    params: IdParamSchema,
    body: UpdateProductSchema,
  })
  .delete("/:id", ({ params }) =>
    db.product.delete({
      where: { id: params.id },
    }),
  {
    params: IdParamSchema,
  });