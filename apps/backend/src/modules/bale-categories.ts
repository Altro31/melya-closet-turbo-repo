import { Elysia } from "elysia";
import { db } from "../db";
import { CreateBaleCategorySchema, UpdateBaleCategorySchema } from "../schemas/models";
import { IdParamSchema } from "./common";

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