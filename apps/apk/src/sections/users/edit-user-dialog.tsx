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
import { useEffect, useState } from "react";
import type { useUsers } from "@/sections/users/hooks/use-users";

type UserRow = ReturnType<typeof useUsers>["data"][number];

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

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserRow | null;
  onEditUser: (changes: {
    name: string;
    email: string;
    phone: string;
  }) => void;
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  onEditUser,
}: EditUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    setFormData({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
    });
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    onEditUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
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
          <DialogTitle className="text-xl font-serif">Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifica los datos del usuario seleccionado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-user-name">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-user-name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: getInputValue(e) }))
              }
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-user-email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-user-email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: getInputValue(e) }))
              }
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-user-phone">
              Teléfono <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-user-phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: getInputValue(e) }))
              }
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
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

