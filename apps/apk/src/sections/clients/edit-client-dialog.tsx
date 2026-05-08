"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import type { useClients } from "@/sections/clients/hooks/use-clients";

type ClientRow = ReturnType<typeof useClients>["data"][number];

type InputChangeEvent = {
  target: {
    value: string;
  };
};

const getInputValue = (event: unknown) => {
  const maybeEvent = event as Partial<InputChangeEvent>;
  return typeof maybeEvent.target?.value === "string"
    ? maybeEvent.target.value
    : "";
};

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientRow | null;
  onEditClient: (changes: {
    name?: string;
    phone?: string;
    address?: string;
    details: string;
  }) => void;
}

export function EditClientDialog({
  open,
  onOpenChange,
  client,
  onEditClient,
}: EditClientDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    details: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!client) return;
    setFormData({
      name: client.name ?? "",
      phone: client.phone ?? "",
      address: client.address ?? "",
      details: client.details ?? "",
    });
  }, [client]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name && !formData.phone && !formData.address) {
      newErrors.contact = "Ingresa nombre, teléfono o dirección";
    }
    if (!formData.details.trim()) {
      newErrors.details = "Los detalles son requeridos";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    onEditClient({
      name: formData.name.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      address: formData.address.trim() || undefined,
      details: formData.details.trim(),
    });
    setErrors({});
    setIsLoading(false);
  };

  const handleClose = () => {
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">Editar Cliente</DialogTitle>
          <DialogDescription>
            Modifica los datos del cliente seleccionado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-client-name">Nombre</Label>
              <Input
                id="edit-client-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: getInputValue(e) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-client-phone">Teléfono</Label>
              <Input
                id="edit-client-phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: getInputValue(e) }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-client-address">Dirección</Label>
            <Input
              id="edit-client-address"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: getInputValue(e) }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-client-details">
              Detalles <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="edit-client-details"
              value={formData.details}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, details: getInputValue(e) }))
              }
              rows={3}
              className={errors.details ? "border-destructive" : ""}
            />
            {errors.contact && (
              <p className="text-xs text-destructive">{errors.contact}</p>
            )}
            {errors.details && (
              <p className="text-xs text-destructive">{errors.details}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading && <Spinner className="h-4 w-4" />}
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

