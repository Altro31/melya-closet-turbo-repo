"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "@base-ui/react";
import { FileText, UserRound } from "lucide-react";
import type { useClientLogs } from "@/sections/client-logs/hooks/use-client-logs";

type ClientLogRow = ReturnType<typeof useClientLogs>["data"][number];

interface ClientLogDetailsPayload {
  clientLog: ClientLogRow;
}

export const clientLogDetailsDialog =
  DialogPrimitive.createHandle<ClientLogDetailsPayload>();

export function ClientLogDetailsDialog() {
  return (
    <Dialog handle={clientLogDetailsDialog}>
      {({ payload }) => {
        if (!payload) return null;
        const { clientLog } = payload as ClientLogDetailsPayload;

        return (
          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif">
                {clientLog.action}
              </DialogTitle>
              <DialogDescription>{clientLog.id}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground mb-1">Cliente</p>
                <p className="font-medium flex items-center gap-2">
                  <UserRound className="h-4 w-4" />
                  {clientLog.Client?.name || "Sin cliente"}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground mb-1">Detalle</p>
                <p className="font-medium flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5" />
                  {clientLog.details}
                </p>
              </div>
            </div>
          </DialogContent>
        );
      }}
    </Dialog>
  );
}

