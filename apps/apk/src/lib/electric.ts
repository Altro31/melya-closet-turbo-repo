import { isProd } from "./tauri.ts" with { type: "macro" };
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import {
  createTauriSQLitePersistence,
  persistedCollectionOptions,
} from "@tanstack/tauri-db-sqlite-persistence";
import {
  createBrowserWASQLitePersistence,
  openBrowserWASQLiteOPFSDatabase,
} from "@tanstack/browser-db-sqlite-persistence";
import Database from "@tauri-apps/plugin-sql";
import { apiUrlBuilder } from "@/lib/api-client.ts";

type TableName =
  | "bale"
  | "category"
  | "client"
  | "client_log"
  | "order"
  | "product"
  | "user_log"
  | "user";

async function getPersistence() {
  if (isProd()) {
    const database = await Database.load(`sqlite:tanstack-db.sqlite`);

    return createTauriSQLitePersistence({
      database,
    });
  } else {
    const database = await openBrowserWASQLiteOPFSDatabase({
      databaseName: `tanstack-db.sqlite`,
    });

    return createBrowserWASQLitePersistence({
      database,
    });
  }
}

const persistence = await getPersistence();

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
      url: apiUrlBuilder.electric(),
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
      schemaVersion: 1,
    }),
  );
};
