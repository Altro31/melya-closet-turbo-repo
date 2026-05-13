import type { DB } from "@/common/db/base";
import { Context, Effect, Layer } from "effect";

export class DatabaseClientMock extends Context.Service<DatabaseClientMock>()("DatabaseClient", {
  make: () => Effect.succeed({} as DB),
}) {
  static readonly layer = Layer.effect(this, this.make());
}
