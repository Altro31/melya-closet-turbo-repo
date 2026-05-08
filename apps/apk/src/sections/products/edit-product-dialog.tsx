"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { allSizes } from "./products-content";
import type { BaleOption } from "./add-product-dialog";

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditProduct: (changes: {
    name: string;
    description?: string;
    price: number;
    currentCount: number;
    sizes: string[];
    baleId: string;
  }) => void;
  bales: BaleOption[];
  product: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    currentCount: number;
    sizes: string[];
    baleId: string;
  } | null;
}

export function EditProductDialog({
  open,
  onOpenChange,
  onEditProduct,
  bales,
  product,
}: EditProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    sizes: [] as string[],
    baleId: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        quantity: product.currentCount.toString(),
        sizes: product.sizes,
        baleId: product.baleId,
        description: product.description ?? "",
      });
    }
  }, [product]);

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "El precio debe ser mayor a 0";
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = "La cantidad debe ser 0 o mayor";
    }
    if (formData.sizes.length === 0) {
      newErrors.sizes = "Selecciona al menos una talla";
    }
    if (!formData.baleId) {
      newErrors.baleId = "Selecciona una paca";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    onEditProduct({
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      currentCount: parseInt(formData.quantity),
      sizes: formData.sizes,
      description: formData.description.trim() || undefined,
      baleId: formData.baleId,
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
      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">
            Editar Producto
          </DialogTitle>
          <DialogDescription>
            Modifica los detalles del producto. Los campos marcados con * son
            obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Bale Selection */}
          <div className="space-y-2">
            <Label htmlFor="edit-baleId">
              Paca <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.baleId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, baleId: value ?? "" }))
              }
            >
              <SelectTrigger
                id="edit-baleId"
                className={errors.baleId ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Selecciona una paca" />
              </SelectTrigger>
              <SelectContent>
                {bales.map((bale) => (
                  <SelectItem key={bale.id} value={bale.id}>
                    {bale.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.baleId && (
              <p className="text-xs text-destructive">{errors.baleId}</p>
            )}
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">
              Nombre del Producto <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-name"
              placeholder="Ej: Vestido Floral Elegante"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Price and Quantity Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">
                Precio ($) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-quantity">
                Stock Actual <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-quantity"
                type="number"
                min="0"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
                className={errors.quantity ? "border-destructive" : ""}
              />
              {errors.quantity && (
                <p className="text-xs text-destructive">{errors.quantity}</p>
              )}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <Label>
              Tallas Disponibles <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-wrap gap-3">
              {allSizes.map((size) => (
                <div key={size} className="flex items-center gap-2">
                  <Checkbox
                    id={`edit-size-${size}`}
                    checked={formData.sizes.includes(size)}
                    onCheckedChange={() => handleSizeToggle(size)}
                  />
                  <Label
                    htmlFor={`edit-size-${size}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </div>
            {errors.sizes && (
              <p className="text-xs text-destructive">{errors.sizes}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Descripción (opcional)</Label>
            <Textarea
              id="edit-description"
              placeholder="Descripción breve del producto..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
            />
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
