"use client";

import { type Bale } from "@/types/bale";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useBale } from "@/sections/inventory/hooks/use-bale";
import { Dialog as DialogPrimitive } from "@base-ui/react";
import {
  Package,
  DollarSign,
  Calendar,
  AlertTriangle,
  Archive,
  Clock,
  CheckCircle,
  FileText,
} from "lucide-react";

interface BaleDetailsPayload {
  bale: Bale;
}

export const baleDetailsDialog =
  DialogPrimitive.createHandle<BaleDetailsPayload>();

const statusConfig: Record<
  Bale["status"],
  {
    label: string;
    className: string;
    icon: typeof CheckCircle;
  }
> = {
  activa: {
    label: "Activo",
    className: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  dea: {
    label: "De alta",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
};

export function BaleDetailsDialog() {
  return (
    <Dialog handle={baleDetailsDialog}>
      {({ payload }) => {
        if (!payload) return null;
        const { bale } = payload as BaleDetailsPayload;

        return <BaleDetailsDialogContent id={bale.id} />;
      }}
    </Dialog>
  );
}

function BaleDetailsDialogContent({ id }: { id: string }) {
  const { data: bale } = useBale(id);
  if (!bale) return null;
  const status = statusConfig[bale.status];
  const StatusIcon = status.icon;
  const usedPercentage =
    ((bale.initialTotal - bale.currentTotal) / bale.initialTotal) * 100;
  const soldItems = Math.max(
    0,
    bale.initialTotal - bale.currentTotal - bale.merma
  );
  return (
    <DialogContent className="sm:max-w-137.5">
      <DialogHeader>
        <DialogTitle className="text-xl font-serif flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5 text-primary" />
          </div>
          {bale.name}
        </DialogTitle>
        <DialogDescription className="flex items-center gap-2">
          {bale.id}
          <span className="text-muted-foreground">•</span>
          <Badge variant="outline" className={cn("text-xs", status.className)}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="p-4 bg-linear-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Valor del Lote</p>
              <p className="text-2xl font-bold text-foreground">
                ${bale.price.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Archive className="h-4 w-4 text-muted-foreground" />
            Información de Stock
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-secondary/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">
                {bale.initialTotal}
              </p>
              <p className="text-xs text-muted-foreground">Inicial</p>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary">
                {bale.currentTotal}
              </p>
              <p className="text-xs text-muted-foreground">Disponible</p>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{soldItems}</p>
              <p className="text-xs text-muted-foreground">Vendidos</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progreso de venta</span>
              <span className="font-medium">{Math.round(usedPercentage)}%</span>
            </div>
            <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  usedPercentage >= 100
                    ? "bg-gray-400"
                    : usedPercentage >= 80
                    ? "bg-green-500"
                    : usedPercentage >= 50
                    ? "bg-primary"
                    : "bg-blue-500"
                )}
                style={{ width: `${Math.min(100, usedPercentage)}%` }}
              />
            </div>
          </div>
        </div>

        {bale.merma > 0 && (
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Productos Dañados
              </p>
              <p className="text-xs text-amber-700">
                {bale.merma} unidades reportadas como dañadas
              </p>
            </div>
          </div>
        )}

        {bale.description && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Descripción
            </h4>
            <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg">
              {bale.description}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Fechas
          </h4>
          <div className="grid gap-2">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">
                Fecha de creación
              </span>
              <span className="text-sm font-medium text-foreground">
                {new Date(bale.createdAt).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {bale.updatedAt && (
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Última actualización
                </span>
                <span className="text-sm font-medium text-foreground">
                  {new Date(bale.updatedAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
            {bale.completedAt && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">
                  Fecha de completado
                </span>
                <span className="text-sm font-medium text-green-600">
                  {new Date(bale.completedAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
