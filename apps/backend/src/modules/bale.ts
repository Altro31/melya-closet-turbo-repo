import { Effect, Schema } from "effect";
import { HttpApi, HttpApiBuilder, HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi";
import { DatabaseClient } from "../common/db";
import { IdParams } from "./common";

export class BaleModule {
  static api = HttpApi.make("Api").add(
    HttpApiGroup.make("bales")
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
      .prefix("/bales"),
  );

  static group = HttpApiBuilder.group(this.api, "bales", (handlers) =>
    handlers
      .handle(
        "create",
        Effect.fn("BaleModule.create")(function* ({ payload }) {
          const client = yield* DatabaseClient;
          return yield* Effect.promise(() => client.bale.create({ data: payload as any }));
        }, Effect.provide(DatabaseClient.layer)),
      )
      .handle(
        "update",
        Effect.fn("BaleModule.update")(function* ({ params, payload }) {
          const client = yield* DatabaseClient;
          return yield* Effect.promise(() =>
            client.bale.update({ where: { id: params.id }, data: payload as any }),
          );
        }, Effect.provide(DatabaseClient.layer)),
      )
      .handle(
        "delete",
        Effect.fn("BaleModule.delete")(function* ({ params }) {
          const client = yield* DatabaseClient;
          return yield* Effect.promise(() => client.bale.delete({ where: { id: params.id } }));
        }, Effect.provide(DatabaseClient.layer)),
      ),
  );
}