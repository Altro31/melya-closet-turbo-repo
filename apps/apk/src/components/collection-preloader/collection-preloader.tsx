"use client";

import { preloadedCollections } from "@/lib/collections";
import {
  getOfflineReadinessSnapshot,
  setRouteChunksStatus,
} from "@/lib/offline-readiness";
import { routeContentLoaders } from "@/lib/route-content-modules";
import { useEffect } from "react";

export default function CollectionPreloader() {
  useEffect(() => {
    preloadedCollections.forEach(({ collection }) => {
      void collection.preload();
    });

    const preloadRouteChunks = () => {
      if (!navigator.onLine) {
        return;
      }

      if (getOfflineReadinessSnapshot().routeChunksStatus === "ready") {
        return;
      }

      setRouteChunksStatus("loading");

      void Promise.allSettled(routeContentLoaders.map((load) => load())).then(
        (results) => {
          if (results.every((result) => result.status === "fulfilled")) {
            setRouteChunksStatus("ready");
            return;
          }

          setRouteChunksStatus("error");
        }
      );
    };

    const timeoutId = window.setTimeout(preloadRouteChunks, 500);
    window.addEventListener("online", preloadRouteChunks);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("online", preloadRouteChunks);
    };
  }, []);

  return null;
}
