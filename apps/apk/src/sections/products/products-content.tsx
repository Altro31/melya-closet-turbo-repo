"use client";

import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/lib/collections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBales, useProducts } from "@/sections/products/hook/use-products";
import { useProductsFilters } from "@/sections/products/hook/use-products-filters";
import { AlertTriangle, Package, Plus, Shirt } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AddProductDialog } from "./add-product-dialog";
import { EditProductDialog } from "./edit-product-dialog";
import { ProductDetailsDialog } from "./product-details-dialog";
import { ProductsFilters } from "./products-filters";
import { ProductsTable } from "./products-table";
import {
  DataCard,
  DataCardContent,
  DataCardGroud,
  DataCardHeader,
  DataCardMedia,
  DataCardTitle,
  DataCardValue,
  DataCardValueDescription,
} from "@/components/ui/data-card";

export const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];

type ProductRow = ReturnType<typeof useProducts>["data"][number];

export default function ProductsContent() {
  const [filters, setFilters] = useProductsFilters();
  const { data: products } = useProducts(filters);
  const { data: bales } = useBales();

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(
    null
  );

  const openEditDialog = (product: ProductRow) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  const openDeleteDialog = (product: ProductRow) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const resetDialogs = () => {
    setAddOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setSelectedProduct(null);
  };

  const handleAddProduct = (data: {
    name: string;
    description?: string;
    price: number;
    initiaCount: number;
    currentCount: number;
    sizes: string[];
    baleId: string;
  }) => {
    const duplicated = products.some(
      (p) => p.name.toLowerCase() === data.name.toLowerCase()
    );
    if (duplicated) {
      toast.error("Ya existe un producto con ese nombre");
      return;
    }

    createProductAction({
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      price: data.price,
      initiaCount: data.initiaCount,
      currentCount: data.currentCount,
      sizes: data.sizes,
      baleId: data.baleId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    toast.success("Producto creado correctamente");
    resetDialogs();
  };

  const handleEditProduct = (changes: {
    name: string;
    description?: string;
    price: number;
    currentCount: number;
    sizes: string[];
    baleId: string;
  }) => {
    if (!selectedProduct) return;

    const duplicated = products.some(
      (p) =>
        p.id !== selectedProduct.id &&
        p.name.toLowerCase() === changes.name.toLowerCase()
    );
    if (duplicated) {
      toast.error("Ya existe un producto con ese nombre");
      return;
    }

    updateProductAction([selectedProduct.id, changes]);
    toast.success("Producto actualizado correctamente");
    resetDialogs();
  };

  const handleDeleteProduct = () => {
    if (!selectedProduct) return;
    deleteProductAction(selectedProduct.id);
    toast.success("Producto eliminado correctamente");
    resetDialogs();
  };

  const handleClearFilters = () => {
    setFilters({
      search: null,
      bale: null,
      size: null,
      minPrice: null,
      maxPrice: null,
      minQuantity: null,
      maxQuantity: null,
    });
  };

  const totalProducts = products.length;
  const totalInventory = products.reduce(
    (acc, product) => acc + product.currentCount,
    0
  );
  const lowStockCount = products.filter(
    (product) => product.currentCount < 10
  ).length;

  const cards = [
    {
      title: "Total Productos",
      Icon: Shirt,
      value: totalProducts,
      description: "productos registrados",
    },
    {
      title: "Inventario Total",
      Icon: Package,
      value: totalInventory,
      description: "unidades en stock",
    },
    {
      title: "Stock Bajo",
      Icon: AlertTriangle,
      value: lowStockCount,
      description: "productos con menos de 10 unidades",
    },
  ];

  return (
    <div className="space-y-6">
      <ProductDetailsDialog />

      {/* Quick Stats */}
      <DataCardGroud>
        {cards.map(({ Icon, description, title, value }) => (
          <DataCard key={title}>
            <DataCardHeader>
              <DataCardTitle>{title}</DataCardTitle>
              <DataCardMedia>
                <Icon />
              </DataCardMedia>
            </DataCardHeader>
            <DataCardContent>
              <DataCardValue>{value}</DataCardValue>
              <DataCardValueDescription>{description}</DataCardValueDescription>
            </DataCardContent>
          </DataCard>
        ))}
      </DataCardGroud>

      {/* Filters and Table */}
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Listado de Productos
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {products.length} productos
            </p>
          </div>
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar Producto
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProductsFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
            bales={bales}
          />
          <ProductsTable
            filters={filters}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            onAdd={() => setAddOpen(true)}
          />
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <AddProductDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAddProduct={handleAddProduct}
        bales={bales}
      />

      {/* Edit Product Dialog */}
      <EditProductDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onEditProduct={handleEditProduct}
        bales={bales}
        product={selectedProduct}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Producto</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar{" "}
              <span className="font-semibold">{selectedProduct?.name}</span>?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose render={<Button variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
