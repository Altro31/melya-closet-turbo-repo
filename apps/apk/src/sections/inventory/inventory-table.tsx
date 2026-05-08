"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { LocalRowBadge, isLocalRow } from "@/components/ui/local-row-badge";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { baleDetailsDialog } from "@/sections/inventory/components/dialogs/bale-details-dialog";
import { deleteBaleDialog } from "@/sections/inventory/components/dialogs/delete-bale-dialog";
import { editBaleDialog } from "@/sections/inventory/components/dialogs/edit-bale-dialog";
import { useBales } from "@/sections/inventory/hooks/use-bales";
import { useBalesFilters } from "@/sections/inventory/hooks/use-bales-filters";
import { AlertTriangle, Eye, Package, Pencil, Trash2 } from "lucide-react";

type BaleRow = ReturnType<typeof useBales>["data"][number];

export function InventoryTable() {
  const [filters] = useBalesFilters();
  const { data: bales } = useBales(filters);
  if (bales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">
          No se encontraron lotes
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          No hay lotes que coincidan con los filtros seleccionados. Intenta
          ajustar los criterios de búsqueda.
        </p>
      </div>
    );
  }

  const columns: ColumnDef<BaleRow>[] = [
    {
      id: "lot",
      accessorKey: "name",
      header: "Lote",
      meta: {
        label: "Lote",
      },
      cell: ({ row }) => {
        const lot = row.original;

        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-foreground">{lot.name}</p>
                <LocalRowBadge isLocal={isLocalRow(lot)} />
              </div>
              {lot.description ? (
                <Tooltip>
                  <TooltipTrigger
                    className="text-xs text-muted-foreground truncate max-w-37.5 cursor-help"
                    render={<p />}
                  >
                    {lot.description}
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-75">
                    <p>{lot.description}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <p className="text-xs text-muted-foreground">{lot.id}</p>
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
        const lot = row.original;

        return (
          <span className="font-semibold text-foreground">
            ${lot.price.toLocaleString()}
          </span>
        );
      },
    },
    {
      id: "available",
      accessorKey: "currentTotal",
      header: "Disponible",
      meta: {
        label: "Disponible",
      },
      cell: ({ row }) => {
        const lot = row.original;

        return (
          <div className="flex flex-col gap-1">
            <span className="font-medium text-foreground">
              {lot.currentTotal}
            </span>
          </div>
        );
      },
    },
    {
      id: "initial",
      accessorKey: "initialTotal",
      header: "Inicial",
      meta: {
        label: "Inicial",
      },
      cell: ({ row }) => {
        const lot = row.original;

        return (
          <span className="text-muted-foreground">{lot.initialTotal}</span>
        );
      },
    },
    {
      id: "damaged",
      accessorKey: "merma",
      header: "Dañados",
      meta: {
        label: "Dañados",
      },
      cell: ({ row }) => {
        const lot = row.original;

        return lot.merma > 0 ? (
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <Badge
              variant="outline"
              className="text-xs bg-amber-50 text-amber-700 border-amber-200"
            >
              {lot.merma}
            </Badge>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">0</span>
        );
      },
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Creación",
      meta: {
        label: "Creación",
      },
      cell: ({ row }) => {
        const lot = row.original;

        return (
          <div className="text-sm">
            <p className="text-foreground">
              {new Date(lot.createdAt).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        );
      },
    },
    {
      id: "updatedAt",
      accessorKey: "updatedAt",
      header: "Última Act.",
      meta: {
        label: "Última actualización",
      },
      cell: ({ row }) => {
        const lot = row.original;

        return (
          <div className="text-sm">
            {lot.updatedAt ? (
              <>
                <p className="text-foreground">
                  {new Date(lot.updatedAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(lot.updatedAt).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </>
            ) : (
              "-"
            )}
          </div>
        );
      },
    },
    {
      id: "completedAt",
      accessorKey: "completedAt",
      header: "Completado",
      meta: {
        label: "Completado",
      },
      cell: ({ row }) => {
        const lot = row.original;

        return lot.completedAt ? (
          <div className="text-sm">
            <p className="text-foreground">
              {new Date(lot.completedAt).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground italic">-</span>
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
        const lot = row.original;

        return (
          <DataTableRowActions>
            <DropdownMenuItem
              className="gap-2"
              onClick={() => baleDetailsDialog.openWithPayload({ bale: lot })}
            >
              <Eye className="h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2"
              onClick={() => editBaleDialog.openWithPayload({ bale: lot })}
            >
              <Pencil className="h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive"
              onClick={() => deleteBaleDialog.openWithPayload({ bale: lot })}
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
    <TooltipProvider>
      <DataTable
        columns={columns}
        data={bales}
        pagination={{
          initialPageSize: 10,
          pageSizeOptions: [10, 20, 50],
        }}
        getRowClassName="group"
        getRowId={(lot) => lot.id}
        selection={{}}
      />
    </TooltipProvider>
  );
}
