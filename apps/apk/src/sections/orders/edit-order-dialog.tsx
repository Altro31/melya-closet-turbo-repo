"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { OrderRow } from "./hooks/use-orders";
import {
  orderStatuses,
  orderTypes,
  paymentMethods,
  type OrderFormValues,
  type OrderPartyOption,
} from "./order-types";

interface EditOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderRow;
  onSave: (orderId: string, changes: OrderFormValues) => void;
  clients: OrderPartyOption[];
  users: OrderPartyOption[];
}

export function EditOrderDialog({
  open,
  onOpenChange,
  order,
  onSave,
  clients,
  users,
}: EditOrderDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OrderFormValues>({
    status: order.status,
    orderType: order.orderType,
    paymentMethod: order.paymentMethod,
    clientId: order.clientId || "",
    userId: order.userId,
    details: order.details,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      status: order.status,
      orderType: order.orderType,
      paymentMethod: order.paymentMethod,
      clientId: order.clientId || "",
      userId: order.userId,
      details: order.details,
    });
  }, [order]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.status) {
      newErrors.status = "Selecciona un estado";
    }
    if (!formData.orderType) {
      newErrors.orderType = "Selecciona un tipo de pedido";
    }
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Selecciona un método de pago";
    }
    if (!formData.userId) {
      newErrors.userId = "Selecciona un usuario responsable";
    }
    if (!formData.details.trim()) {
      newErrors.details = "Agrega una descripción para el pedido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    onSave(order.id, { ...formData, details: formData.details.trim() });
    setIsLoading(false);
  };

  const handleClose = () => {
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">
            Editar Pedido {order.id}
          </DialogTitle>
          <DialogDescription>
            Ajusta los datos persistidos del pedido. La actualización es inmediata y optimista.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="status">
                Estado <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as OrderFormValues["status"],
                  }))
                }
              >
                <SelectTrigger
                  id="status"
                  className={errors.status ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {orderStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-xs text-destructive">{errors.status}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderType">
                Tipo de Pedido <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.orderType}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    orderType: value as OrderFormValues["orderType"],
                  }))
                }
              >
                <SelectTrigger
                  id="orderType"
                  className={errors.orderType ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {orderTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.orderType && (
                <p className="text-xs text-destructive">{errors.orderType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">
                Método de Pago <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentMethod: value as OrderFormValues["paymentMethod"],
                  }))
                }
              >
                <SelectTrigger
                  id="paymentMethod"
                  className={errors.paymentMethod ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Seleccionar pago" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.paymentMethod && (
                <p className="text-xs text-destructive">
                  {errors.paymentMethod}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="userId">
                Usuario responsable <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.userId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, userId: value ?? "" }))
                }
              >
                <SelectTrigger
                  id="userId"
                  className={errors.userId ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Seleccionar usuario" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.userId && (
                <p className="text-xs text-destructive">{errors.userId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId">Cliente</Label>
              <Select
                value={formData.clientId || "none"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    clientId: value === "none" ? "" : value ?? "",
                  }))
                }
              >
                <SelectTrigger id="clientId">
                  <SelectValue placeholder="Sin cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin cliente</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">
              Detalles del pedido <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="details"
              placeholder="Resumen del pedido, observaciones o referencias"
              value={formData.details}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, details: e.target.value }))
              }
              className={errors.details ? "border-destructive" : ""}
              rows={4}
            />
            {errors.details && (
              <p className="text-xs text-destructive">{errors.details}</p>
            )}
            <p className="text-xs text-muted-foreground">
              El total visible se calcula desde los productos relacionados en el servidor.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
