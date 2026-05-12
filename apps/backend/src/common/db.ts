import { ZenStackClient } from "@zenstackhq/orm";
import { PostgresDialect } from "@zenstackhq/orm/dialects/postgres";
import { Pool } from "pg";
import { schema } from "@repo/db/schema.ts";
import { Context, Effect, Layer } from "effect";

export const db = new ZenStackClient(schema, {
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
  computedFields: {
    order: {
      totalPrice: (expressionBuilder) =>
        expressionBuilder
          .selectFrom("OrderProduct")
          .whereRef("orderId", "=", "Order.id")
          .select(({ fn }) => fn.countAll<number>().as("count")),
    },
  },
});

export class DatabaseClient extends Context.Service<DatabaseClient>()("DatabaseClient", {
  make: () => Effect.succeed(db),
}) {
  static readonly layer = Layer.effect(this, this.make());
}
