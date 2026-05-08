"use client";

import { LocalRowBadge, isLocalRow } from "@/components/ui/local-row-badge";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock3,
  CreditCard,
  Package,
  Phone,
  User,
  Store,
  Globe,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderRow } from "./hooks/use-orders";

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderRow;
}

const statusConfig = {
  pendiente: {
    label: "Pendiente",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  en_proceso: {
    label: "En Proceso",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  completado: {
    label: "Completado",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  cancelado: {
    label: "Cancelado",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

const orderTypeConfig = {
  tienda: { label: "Tienda", icon: Store },
  online: { label: "Online", icon: Globe },
  mayoreo: { label: "Mayoreo", icon: Package },
};

const paymentMethodConfig = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
  mixto: "Mixto",
};

export function OrderDetailsDialog({
  open,
  onOpenChange,
  order,
}: OrderDetailsDialogProps) {
  const status = statusConfig[order.status as keyof typeof statusConfig];
  const orderType = orderTypeConfig[order.orderType as keyof typeof orderTypeConfig];
  const TypeIcon = orderType.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-137.5">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-xl font-serif">
                Detalles del Pedido
              </DialogTitle>
              <LocalRowBadge isLocal={isLocalRow(order)} />
            </div>
            <Badge variant="outline" className={cn("text-xs", status.className)}>
              {status.label}
            </Badge>
          </div>
          <DialogDescription>
            Pedido {order.id} -{" "}
            {new Date(order.orderDate).toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TypeIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tipo de Pedido</p>
                <p className="font-medium">{orderType.label}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Método de Pago</p>
                <p className="font-medium">
                  {paymentMethodConfig[order.paymentMethod]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Creado</p>
                <p className="font-medium">
                  {new Date(order.orderDate).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Última actualización</p>
                <p className="font-medium">
                  {new Date(order.updatedAt).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {order.customer && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Información del Cliente
                </h4>
                <div className="pl-6 space-y-1">
                  <p className="text-sm font-medium">{order.customer.name}</p>
                  {order.customer.phone && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      {order.customer.phone}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {order.user && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  Responsable
                </h4>
                <div className="pl-6 space-y-1">
                  <p className="text-sm font-medium">{order.user.name}</p>
                  <p className="text-sm text-muted-foreground">{order.user.email}</p>
                  <p className="text-sm text-muted-foreground">{order.user.phone}</p>
                </div>
              </div>
            </>
          )}

          <Separator />
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Total Calculado
            </h4>
            <div className="flex justify-between rounded-lg bg-secondary/30 p-4 text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${order.amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Notes */}
          {order.details && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Notas
                </h4>
                <p className="text-sm text-muted-foreground pl-6 bg-secondary/30 p-3 rounded-lg">
                  {order.details}
                </p>
              </div>
            </>
          )}

          {/* Status Badge at bottom */}
          {!order.isActive && (
            <div className="flex items-center justify-center p-3 bg-gray-100 rounded-lg">
              <Badge
                variant="outline"
                className="text-xs bg-gray-100 text-gray-600 border-gray-200"
              >
                Este pedido está desactivado
              </Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
