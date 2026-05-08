import { Elysia } from "elysia";
import { db } from "../db.ts";
import { CreateBaleCategorySchema, UpdateBaleCategorySchema } from "../schemas/models.ts";
import { IdParamSchema } from "./common.ts";

export const baleCategoriesModule = new Elysia({ prefix: "/api/bale-categories" })
  .post("/", ({ body }) =>
    db.category.create({
      data: body,
    }),
  {
    body: CreateBaleCategorySchema,
  })
  .patch("/:id", ({ params, body }) =>
    db.category.update({
      where: { id: params.id },
      data: body,
    }),
  {
    params: IdParamSchema,
    body: UpdateBaleCategorySchema,
  })
  .delete("/:id", ({ params }) =>
    db.category.delete({
      where: { id: params.id },
    }),
  {
    params: IdParamSchema,
  });