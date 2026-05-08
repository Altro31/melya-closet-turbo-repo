import { Elysia } from "elysia";
import { db } from "../db";
import { CreateBaleSchema, UpdateBaleSchema } from "../schemas/models";
import { IdParamSchema } from "./common";

export const baleModule = new Elysia({ prefix: "/api/bales" })
  .post("/", ({ body }) =>
    db.bale.create({
      data: body,
    }),
  {
    body: CreateBaleSchema,
  })
  .patch("/:id", ({ params, body }) =>
    db.bale.update({
      where: { id: params.id },
      data: body,
    }),
  {
    params: IdParamSchema,
    body: UpdateBaleSchema,
  })
  .delete("/:id", ({ params }) =>
    db.bale.delete({
      where: { id: params.id },
    }),
  {
    params: IdParamSchema,
  });