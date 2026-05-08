"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { WifiOff } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const OFFLINE_HINT_DELAY_MS = 2500;

export function OfflineRouteLoading({ label }: { label: string }) {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine
  );
  const [showOfflineHint, setShowOfflineHint] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    const timeoutId = window.setTimeout(
      () => setShowOfflineHint(true),
      OFFLINE_HINT_DELAY_MS
    );

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  if (!showOfflineHint || isOnline) {
    return (
      <div className="flex min-h-40 items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/60 px-6 py-10 text-sm text-muted-foreground">
        <Spinner className="size-4" />
        <span>Cargando {label}...</span>
      </div>
    );
  }

  return (
    <Card className="border-dashed">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <WifiOff className="size-5" />
          </div>
          <div>
            <CardTitle>Sin conexión</CardTitle>
            <p className="text-sm text-muted-foreground">
              Esta pantalla todavía no está disponible en caché.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Vuelve a conectarte para terminar de cargar {label} o regresa a una
          sección que ya hayas abierto antes.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            Ir al inicio
          </Button>
          <Button onClick={() => router.reload()}>Reintentar</Button>
        </div>
      </CardContent>
    </Card>
  );
}
