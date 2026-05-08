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
import { DollarSign, Package, Ruler } from "lucide-react";
import type { useProducts } from "@/sections/products/hook/use-products";

type ProductRow = ReturnType<typeof useProducts>["data"][number];

interface ProductDetailsPayload {
  product: ProductRow;
}

export const productDetailsDialog =
  DialogPrimitive.createHandle<ProductDetailsPayload>();

export function ProductDetailsDialog() {
  return (
    <Dialog handle={productDetailsDialog}>
      {({ payload }) => {
        if (!payload) return null;
        const { product } = payload as ProductDetailsPayload;

        return (
          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif">
                {product.name}
              </DialogTitle>
              <DialogDescription>
                {product.description || "Sin descripción"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground mb-1">Precio</p>
                <p className="text-xl font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {product.price.toFixed(2)}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground mb-1">Stock actual</p>
                <p className="text-xl font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {product.currentCount}
                </p>
              </div>

              <div className="rounded-lg border p-4 md:col-span-2">
                <p className="text-xs text-muted-foreground mb-2">Paca</p>
                <Badge
                  variant="outline"
                  className="bg-primary/5 text-primary border-primary/20"
                >
                  {product.Bale?.name ?? "Sin paca"}
                </Badge>
              </div>

              <div className="rounded-lg border p-4 md:col-span-2">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Tallas disponibles
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.length > 0 ? (
                    product.sizes.map((size) => (
                      <Badge key={size} variant="secondary">
                        {size}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Sin tallas
                    </span>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        );
      }}
    </Dialog>
  );
}
