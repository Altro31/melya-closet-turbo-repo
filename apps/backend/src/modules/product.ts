import { Elysia } from "elysia";
import { db } from "../db.ts";
import { CreateProductSchema, UpdateProductSchema } from "../schemas/models.ts";
import { IdParamSchema } from "./common.ts";

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