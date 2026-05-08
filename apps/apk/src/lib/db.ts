import { schema, SchemaType } from "@repo/db/schema/generated/schema";
import type { Txid } from "@tanstack/electric-db-collection";
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
      totalPrice: (eb, { modelAlias }) =>
        eb
          .selectFrom("OrderProduct")
          .whereRef("orderId", "=", "Order.id")
          .select(({ fn }) => fn.countAll<number>().as("count")),
    },
  },
});

export async function withTxid<
  Fn extends (tx: TransactionClientContract<SchemaType, any, any, any>) => any,
>(fn: Fn) {
  const [txid, res] = await db.$transaction((tx) =>
    Promise.all([tx.$queryRaw<Txid>`SELECT pg_current_xact_id()::xid::text as txid`, fn(tx)]),
  );
  return {
    txid,
    res,
  };
}
