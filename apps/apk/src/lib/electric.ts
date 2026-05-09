import { isProd } from "@/lib/tauri" 
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
      schemaVersion: 1,
    }),
  );
};
