import { Effect, Schema } from "effect";
import { HttpApi, HttpApiBuilder, HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi";
import { DatabaseClient } from "../common/db";
import { IdParams } from "./common";

export class ClientModule {
  static api = HttpApi.make("Api").add(
    HttpApiGroup.make("clients")
      .add(
        HttpApiEndpoint.post("create", "/", {
          payload: Schema.Any,
          success: Schema.Any,
        }),
      )
      .add(
        HttpApiEndpoint.patch("update", "/:id", {
          params: IdParams,
          payload: Schema.Any,
          success: Schema.Any,
        }),
      )
      .add(
        HttpApiEndpoint.delete("delete", "/:id", {
          params: IdParams,
          success: Schema.Any,
        }),
      )
      .prefix("/clients"),
  );

  static group = HttpApiBuilder.group(this.api, "clients", (handlers) =>
    handlers
      .handle(
        "create",
        Effect.fn("ClientModule.create")(function* ({ payload }) {
          const client = yield* DatabaseClient;
          return yield* Effect.promise(() => client.client.create({ data: payload as any }));
        }, Effect.provide(DatabaseClient.layer)),
      )
      .handle(
        "update",
        Effect.fn("ClientModule.update")(function* ({ params, payload }) {
          const client = yield* DatabaseClient;
          return yield* Effect.promise(() =>
            client.client.update({ where: { id: params.id }, data: payload as any }),
          );
        }, Effect.provide(DatabaseClient.layer)),
      )
      .handle(
        "delete",
        Effect.fn("ClientModule.delete")(function* ({ params }) {
          const client = yield* DatabaseClient;
          return yield* Effect.promise(() => client.client.delete({ where: { id: params.id } }));
        }, Effect.provide(DatabaseClient.layer)),
      ),
  );
}