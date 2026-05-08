import { Elysia } from "elysia";
import { db } from "../db.ts";
import { CreateClientSchema, UpdateClientSchema } from "../schemas/models.ts";
import { IdParamSchema } from "./common.ts";

export const clientModule = new Elysia({ prefix: "/api/clients" })
  .post("/", ({ body }) =>
    db.client.create({
      data: body,
    }),
  {
    body: CreateClientSchema,
  })
  .patch("/:id", ({ params, body }) =>
    db.client.update({
      where: { id: params.id },
      data: body,
    }),
  {
    params: IdParamSchema,
    body: UpdateClientSchema,
  })
  .delete("/:id", ({ params }) =>
    db.client.delete({
      where: { id: params.id },
    }),
  {
    params: IdParamSchema,
  });