import { schema, type SchemaType } from "../../../packages/db/schema/generated/schema";
import { ZenStackClient, type TransactionClientContract } from "@zenstackhq/orm";
import { PostgresDialect } from "@zenstackhq/orm/dialects/postgres";
import { Pool } from "pg";

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
