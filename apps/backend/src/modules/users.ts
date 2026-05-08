import { Elysia } from "elysia";
import { db } from "../db.ts";
import { CreateUserSchema, UpdateUserSchema } from "../schemas/models.ts";
import { IdParamSchema } from "./common.ts";

export const userModule = new Elysia({ prefix: "/api/users" })
  .post("/", ({ body }) =>
    db.user.create({
      data: body,
    }),
  {
    body: CreateUserSchema,
  })
  .patch("/:id", ({ params, body }) =>
    db.user.update({
      where: { id: params.id },
      data: body,
    }),
  {
    params: IdParamSchema,
    body: UpdateUserSchema,
  })
  .delete("/:id", ({ params }) =>
    db.user.delete({
      where: { id: params.id },
    }),
  {
    params: IdParamSchema,
  });