import { Elysia } from "elysia";
import { db } from "../db";
import { CreateOrderSchema, UpdateOrderSchema } from "../schemas/models";
import { IdParamSchema } from "./common";

export const orderModule = new Elysia({ prefix: "/api/orders" })
  .post("/", ({ body }) =>
    db.order.create({
      data: body,
    }),
  {
    body: CreateOrderSchema,
  })
  .patch("/:id", ({ params, body }) =>
    db.order.update({
      where: { id: params.id },
      data: body,
    }),
  {
    params: IdParamSchema,
    body: UpdateOrderSchema,
  })
  .delete("/:id", ({ params }) =>
    db.order.delete({
      where: { id: params.id },
    }),
  {
    params: IdParamSchema,
  });