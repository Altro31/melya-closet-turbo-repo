import { Elysia } from "elysia";
import { db } from "../db";
import { CreateClientSchema, UpdateClientSchema } from "../schemas/models";
import { IdParamSchema } from "./common";

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