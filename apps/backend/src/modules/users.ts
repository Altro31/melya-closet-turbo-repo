import { Effect, Schema } from "effect";
import { HttpApi, HttpApiBuilder, HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi";
import { DatabaseClient } from "@/common/db";
import { IdParams } from "@/lib/params";

export class UserModule {
  static api = HttpApi.make("Api").add(
    HttpApiGroup.make("users")
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
      .prefix("/users"),
  );

  static group = HttpApiBuilder.group(this.api, "users", (handlers) =>
    handlers
      .handle(
        "create",
        Effect.fn("UserModule.create")(function* ({ payload }) {
          const client = yield* DatabaseClient;
          return yield* Effect.promise(() => client.user.create({ data: payload as any }));
        }, Effect.provide(DatabaseClient.layer)),
      )
      .handle(
        "update",
        Effect.fn("UserModule.update")(function* ({ params, payload }) {
          const client = yield* DatabaseClient;
          return yield* Effect.promise(() =>
            client.user.update({ where: { id: params.id }, data: payload as any }),
          );
        }, Effect.provide(DatabaseClient.layer)),
      )
      .handle(
        "delete",
        Effect.fn("UserModule.delete")(function* ({ params }) {
          const client = yield* DatabaseClient;
          return yield* Effect.promise(() => client.user.delete({ where: { id: params.id } }));
        }, Effect.provide(DatabaseClient.layer)),
      ),
  );
}