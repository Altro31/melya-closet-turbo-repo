"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { LocalRowBadge, isLocalRow } from "@/components/ui/local-row-badge";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DataTable } from "@/components/ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { useProducts } from "@/sections/products/hook/use-products";
import type { ProductsFilters } from "@/sections/products/hook/use-products-filters";
import { productDetailsDialog } from "@/sections/products/product-details-dialog";
import { Eye, Package, Pencil, Plus, Trash2 } from "lucide-react";

type ProductRow = ReturnType<typeof useProducts>["data"][number];

interface ProductsTableProps {
  filters: ProductsFilters;
  onEdit: (product: ProductRow) => void;
  onDelete: (product: ProductRow) => void;
  onAdd: () => void;
}

export function ProductsTable({
  filters,
  onEdit,
  onDelete,
  onAdd,
}: ProductsTableProps) {
  const { data: products } = useProducts(filters);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Empty>
          <EmptyMedia>
            <Package className="h-8 w-8 text-muted-foreground" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No se encontraron productos</EmptyTitle>
            <EmptyDescription>
              No hay productos que coincidan con los filtros seleccionados.
              Intenta ajustar los criterios de búsqueda.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={onAdd}>
              <Plus /> Agregar producto
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  const columns: ColumnDef<ProductRow>[] = [
    {
      id: "product",
      accessorKey: "name",
      header: "Producto",
      meta: {
        label: "Producto",
      },
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-medium text-primary">
                {product.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-foreground truncate">
                  {product.name}
                </p>
                <LocalRowBadge isLocal={isLocalRow(product)} />
              </div>
              {product.description ? (
                <Tooltip>
                  <TooltipTrigger
                    render={<p />}
                    className="text-xs text-muted-foreground truncate max-w-50 cursor-help"
                  >
                    {product.description}
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-75">
                    <p>{product.description}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Sin descripción
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "price",
      accessorKey: "price",
      header: "Precio",
      meta: {
        label: "Precio",
      },
      cell: ({ row }) => {
        const product = row.original;

        return (
          <span className="font-semibold text-foreground">
            ${product.price.toFixed(2)}
          </span>
        );
      },
    },
    {
      id: "count",
      accessorKey: "currentCount",
      header: () => <div className="text-center">Cantidad</div>,
      meta: {
        label: "Cantidad",
        headerClassName: "text-center",
      },
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="flex justify-center gap-2">
            <span>{product.currentCount}</span>
          </div>
        );
      },
    },
    {
      id: "bale",
      accessorFn: (product) => product.Bale?.name ?? "",
      header: "Paca",
      meta: {
        label: "Paca",
      },
      cell: ({ row }) => {
        const product = row.original;

        return (
          <Badge
            variant="outline"
            className="bg-primary/5 text-primary border-primary/20"
          >
            {product.Bale?.name}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      header: () => <div className="text-right">Acciones</div>,
      meta: {
        label: "Acciones",
        headerClassName: "text-right",
        cellClassName: "text-right",
      },
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DataTableRowActions>
            <DropdownMenuItem
              className="gap-2"
              onClick={() => productDetailsDialog.openWithPayload({ product })}
            >
              <Eye className="h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={() => onEdit(product)}>
              <Pencil className="h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive"
              onClick={() => onDelete(product)}
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DataTableRowActions>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={products}
      pagination={{
        initialPageSize: 10,
        pageSizeOptions: [10, 20, 50],
      }}
      getRowClassName="group"
      getRowId={(product) => product.id}
      selection={{}}
    />
  );
}
