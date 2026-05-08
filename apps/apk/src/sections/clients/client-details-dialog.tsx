"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Dialog as DialogPrimitive } from "@base-ui/react";
import { MapPin, Phone, User } from "lucide-react";
import type { useClients } from "@/sections/clients/hooks/use-clients";

type ClientRow = ReturnType<typeof useClients>["data"][number];

interface ClientDetailsPayload {
  client: ClientRow;
}

export const clientDetailsDialog =
  DialogPrimitive.createHandle<ClientDetailsPayload>();

export function ClientDetailsDialog() {
  return (
    <Dialog handle={clientDetailsDialog}>
      {({ payload }) => {
        if (!payload) return null;
        const { client } = payload as ClientDetailsPayload;

        return (
          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif">
                {client.name || "Cliente sin nombre"}
              </DialogTitle>
              <DialogDescription>{client.id}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground mb-1">Nombre</p>
                  <p className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {client.name || "No especificado"}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground mb-1">Teléfono</p>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {client.phone || "No especificado"}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground mb-1">Dirección</p>
                <p className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {client.address || "No especificada"}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground mb-2">Detalles</p>
                <Badge variant="secondary" className="whitespace-normal text-left">
                  {client.details}
                </Badge>
              </div>
            </div>
          </DialogContent>
        );
      }}
    </Dialog>
  );
}

