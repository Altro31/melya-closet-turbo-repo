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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type {
  Customer,
  Order,
  OrderItem,
} from "./legacy-order-types";
import {
  paymentMethods,
} from "./orders-content";

interface AddOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddOrder: (order: Omit<Order, "id">) => void;
  customers: Customer[];
}

// Sample products for selection
const sampleProducts = [
  { id: "prod-001", name: "Vestido Floral Elegante", price: 89.99 },
  { id: "prod-002", name: "Blusa de Seda", price: 45.0 },
  { id: "prod-003", name: "Falda Midi Plisada", price: 65.5 },
  { id: "prod-004", name: "Pantalón Palazzo", price: 78.0 },
  { id: "prod-005", name: "Top Crop Básico", price: 35.0 },
  { id: "prod-006", name: "Chaqueta Denim", price: 120.0 },
  { id: "prod-007", name: "Vestido Casual", price: 55.0 },
  { id: "prod-008", name: "Cardigan Oversize", price: 68.0 },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormData {
  orderType: string;
  paymentMethod: string;
  hasDelivery: boolean;
  deliveryAddress: string;
  deliveryFee: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  details: string;
  items: {
    productId: string;
    quantity: string;
    size: string;
  }[];
}

const initialFormData: FormData = {
  orderType: "",
  paymentMethod: "",
  hasDelivery: false,
  deliveryAddress: "",
  deliveryFee: "",
  customerId: "",
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  details: "",
  items: [{ productId: "", quantity: "1", size: "" }],
};

export function AddOrderFeria({
  open,
  onOpenChange,
  onAddOrder,
  customers,
}: AddOrderDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [useExistingCustomer, setUseExistingCustomer] = useState(true);

  const handleCustomerChange = (customerId: string | null) => {
    const customer = customers.find((c) => c.id === customerId);
    setFormData((prev) => ({
      ...prev,
      customerId: customerId ?? "",
      customerName: customer?.name || "",
      customerPhone: customer?.phone || "",
      customerEmail: customer?.email || "",
    }));
  };

  const handleItemChange = (
    index: number,
    field: keyof FormData["items"][number],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: "1", size: "" }],
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const calculateTotal = () => {
    return (
      formData.items.reduce((total, item) => {
        const product = sampleProducts.find((p) => p.id === item.productId);
        const quantity = parseInt(item.quantity) || 0;
        return total + (product?.price || 0) * quantity;
      }, 0) + (formData.hasDelivery ? parseFloat(formData.deliveryFee) || 0 : 0)
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.orderType) {
      newErrors.orderType = "Selecciona un tipo de pedido";
    }
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Selecciona un método de pago";
    }
    if (formData.hasDelivery && !formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "La dirección es requerida para entregas";
    }

    const validItems = formData.items.filter(
      (item) => item.productId && parseInt(item.quantity) > 0
    );
    if (validItems.length === 0) {
      newErrors.items = "Agrega al menos un producto";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const items: OrderItem[] = formData.items
      .filter((item) => item.productId && parseInt(item.quantity) > 0)
      .map((item) => {
        const product = sampleProducts.find((p) => p.id === item.productId)!;
        return {
          productId: item.productId,
          productName: product.name,
          quantity: parseInt(item.quantity),
          price: product.price,
          size: item.size || undefined,
        };
      });

    const newOrder: Omit<Order, "id"> = {
      status: "pendiente",
      isActive: true,
      amount: calculateTotal(),
      orderType: formData.orderType as Order["orderType"],
      paymentMethod: formData.paymentMethod as Order["paymentMethod"],
      orderDate: new Date().toISOString(),
      hasDelivery: formData.hasDelivery,
      deliveryAddress: formData.hasDelivery
        ? formData.deliveryAddress.trim()
        : undefined,
      deliveryFee: formData.hasDelivery
        ? parseFloat(formData.deliveryFee) || 0
        : undefined,
      customer: formData.customerName.trim()
        ? {
            name: formData.customerName.trim(),
            phone: formData.customerPhone.trim() || undefined,
            email: formData.customerEmail.trim() || undefined,
          }
        : undefined,
      details: formData.details.trim() || undefined,
      items,
    };

    onAddOrder(newOrder);

    // Reset form
    setFormData(initialFormData);
    setErrors({});
    setIsLoading(false);
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    setUseExistingCustomer(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">Nuevo Pedido</DialogTitle>
          <DialogDescription>
            Completa los detalles del pedido. Los campos marcados con * son
            obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Order Type and Payment Method */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">
                Método de Pago <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentMethod: value ?? "",
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

          {/* Products */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                Productos <span className="text-destructive">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar
              </Button>
            </div>

            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg"
                >
                  <Select
                    value={item.productId}
                    onValueChange={(value) =>
                      handleItemChange(index, "productId", value ?? "")
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ${product.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={item.size}
                    onValueChange={(value) =>
                      handleItemChange(index, "size", value ?? "")
                    }
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Talla" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    min="1"
                    placeholder="Cant."
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    className="w-20"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    disabled={formData.items.length === 1}
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
            {errors.items && (
              <p className="text-xs text-destructive">{errors.items}</p>
            )}

            {/* Total */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="text-lg font-bold text-foreground">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="details">Notas (opcional)</Label>
            <Textarea
              id="details"
              placeholder="Notas adicionales del pedido..."
              value={formData.details}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, details: e.target.value }))
              }
              rows={2}
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
              {isLoading ? "Guardando..." : "Crear Pedido"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
