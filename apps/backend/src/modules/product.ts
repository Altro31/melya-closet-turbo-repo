import { Effect, Schema } from "effect";
import { HttpApi, HttpApiBuilder, HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi";
import { DatabaseClient } from "../common/db";
import { IdParams } from "./common";

export class ProductModule {
  static api = HttpApi.make("Api").add(
    HttpApiGroup.make("products")
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
      .prefix("/products"),
  );

  static group = HttpApiBuilder.group(this.api, "products", (handlers) =>
    handlers
      .handle(
        "create",
        Effect.fn("ProductModule.create")(function* ({ payload }) {
          const client = yield* DatabaseClient;
          return yield* Effect.promise(() => client.product.create({ data: payload as any }));
        }, Effect.provide(DatabaseClient.layer)),
      )
      .handle(
        "update",
        Effect.fn("ProductModule.update")(function* ({ params, payload }) {
          const client = yield* DatabaseClient;
          return yield* Effect.promise(() =>
            client.product.update({ where: { id: params.id }, data: payload as any }),
          );
        }, Effect.provide(DatabaseClient.layer)),
      )
      .handle(
        "delete",
        Effect.fn("ProductModule.delete")(function* ({ params }) {
          const client = yield* DatabaseClient;
          return yield* Effect.promise(() => client.product.delete({ where: { id: params.id } }));
        }, Effect.provide(DatabaseClient.layer)),
      ),
  );
}