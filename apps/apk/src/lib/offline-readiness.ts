type RouteChunksStatus = "idle" | "loading" | "ready" | "error";

type OfflineReadinessSnapshot = {
  routeChunksStatus: RouteChunksStatus;
};

let snapshot: OfflineReadinessSnapshot = {
  routeChunksStatus: "idle",
};

const listeners = new Set<() => void>();

function emit(nextSnapshot: OfflineReadinessSnapshot) {
  const didChange =
    nextSnapshot.routeChunksStatus !== snapshot.routeChunksStatus;

  if (!didChange) {
    return;
  }

  snapshot = nextSnapshot;
  listeners.forEach((listener) => listener());
}

export function getOfflineReadinessSnapshot() {
  return snapshot;
}

export function subscribeOfflineReadiness(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function setRouteChunksStatus(routeChunksStatus: RouteChunksStatus) {
  emit({ routeChunksStatus });
}
