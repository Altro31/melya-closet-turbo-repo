import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import {
  createTauriSQLitePersistence,
  persistedCollectionOptions,
} from "@tanstack/tauri-db-sqlite-persistence";
import Database from "@tauri-apps/plugin-sql";

type TableName =
  | "bale"
  | "category"
  | "client"
  | "client_log"
  | "order"
  | "product"
  | "user_log"
  | "user";

export function getElectricUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://localhost:3000";
  return `${url.replace(/\/$/, "")}/api/electric`;
}

const database = await Database.load(`sqlite:tanstack-db.sqlite`);

const persistence = createTauriSQLitePersistence({
  database,
});

export const createElectricCollection = <T extends { id: string }>({
  id,
  table,
}: {
  id: string;
  table: TableName;
}) => {
  const collectionOptions = electricCollectionOptions<T>({
    id,
    shapeOptions: {
      url: getElectricUrl(),
      params: { table },
    },
    getKey: (i) => i.id,
  });

  if (!persistence) {
    return createCollection(collectionOptions);
  }
  return createCollection(
    persistedCollectionOptions<T, string | number>({
      ...(collectionOptions as any),
      persistence,
      schemaVersion: 3,
    }),
  );
};
