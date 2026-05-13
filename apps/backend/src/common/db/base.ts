import { schema } from "@repo/db/schema.js";
import { ZenStackClient } from "@zenstackhq/orm";
import { PostgresDialect } from "@zenstackhq/orm/dialects/postgres";
import { Context, Effect, Layer } from "effect";
import { Pool } from "pg";

export type DB = typeof db;
const db = new ZenStackClient(schema, {
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

export class DatabaseClientBase extends Context.Service<DatabaseClientBase>()("DatabaseClient", {
  make: () => Effect.succeed(db),
}) {
  static readonly layer = Layer.effect(this, this.make());
}
