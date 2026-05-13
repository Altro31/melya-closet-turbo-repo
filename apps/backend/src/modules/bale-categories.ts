import { Effect, Schema } from "effect";
import { HttpApi, HttpApiBuilder, HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi";
import { DatabaseClient } from "@/common/db";
import { IdParams } from "@/lib/params";

export class BaleCategoriesModule {
  static api = HttpApi.make("Api").add(
    HttpApiGroup.make("baleCategories")
      .add(
        HttpApiEndpoint.post("create", "/", {
          payload: Schema.Any,
          success: Schema.Any,
        }),
      )
      .add(
        HttpApiEndpoint.patch("update", "/:id", {
          payload: Schema.Any,
          success: Schema.Any,
          params: IdParams,
        }),
      )
      .add(
        HttpApiEndpoint.delete("delete", "/:id", {
          success: Schema.Any,
          params: IdParams,
        }),
      )
      .prefix("/bale-categories"),
  );
  static group = HttpApiBuilder.group(this.api, "baleCategories", (handlers) =>
    handlers
      .handle(
        "create",
        Effect.fn("BaleCategoriesModule.create")(function* ({ payload }) {
          const client = yield* DatabaseClient;
          return yield* Effect.promise(() => client.category.create({ data: payload as any }));
        }, Effect.provide(DatabaseClient.layer)),
      )
      .handle(
        "update",
        Effect.fn("BaleCategoriesModule.update")(function* ({ params, payload }) {
          const client = yield* DatabaseClient;
          return yield* Effect.promise(() =>
            client.category.update({ where: { id: params.id }, data: payload as any }),
          );
        }, Effect.provide(DatabaseClient.layer)),
      )
      .handle(
        "delete",
        Effect.fn("BaleCategoriesModule.delete")(function* ({ params }) {
          const client = yield* DatabaseClient;
          return yield* Effect.promise(() => client.category.delete({ where: { id: params.id } }));
        }, Effect.provide(DatabaseClient.layer)),
      ),
  );
}
