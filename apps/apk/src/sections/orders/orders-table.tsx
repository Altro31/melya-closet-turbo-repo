"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  Globe,
  Package,
  Pencil,
  Power,
  PowerOff,
  ShoppingBag,
  Store,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  DataTable,
  type DataTableSelectionAction,
} from "@/components/ui/data-table";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LocalRowBadge, isLocalRow } from "@/components/ui/local-row-badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import type { OrderRow } from "./hooks/use-orders";

interface OrdersTableProps {
  orders: OrderRow[];
  onViewDetails: (order: OrderRow) => void;
  onEdit: (order: OrderRow) => void;
  onDeactivate: (orderId: string) => void;
  onActivate: (orderId: string) => void;
  onDeactivateMany?: (orderIds: string[]) => void;
  onActivateMany?: (orderIds: string[]) => void;
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

export function OrdersTable({
  orders,
  onViewDetails,
  onEdit,
  onDeactivate,
  onActivate,
  onDeactivateMany,
  onActivateMany,
}: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-1 text-lg font-medium text-foreground">
          No se encontraron pedidos
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          No hay pedidos que coincidan con los filtros seleccionados. Intenta
          ajustar los criterios de búsqueda.
        </p>
      </div>
    );
  }

  const columns: ColumnDef<OrderRow>[] = [
    {
      id: "order",
      accessorKey: "id",
      header: "Pedido",
      meta: {
        label: "Pedido",
      },
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground">{order.id}</p>
              <LocalRowBadge isLocal={isLocalRow(order)} className="mt-1" />
              {order.details ? (
                <Tooltip>
                  <TooltipTrigger
                    render={<p />}
                    className="max-w-30 cursor-help truncate text-xs text-muted-foreground"
                  >
                    {order.details}
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-75">
                    <p>{order.details}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <p className="text-xs italic text-muted-foreground">
                  Sin notas
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Estado",
      meta: {
        label: "Estado",
      },
      cell: ({ row }) => {
        const order = row.original;
        const status = statusConfig[order.status];

        return (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-xs", status.className)}
            >
              {status.label}
            </Badge>
            {!order.isActive && (
              <Badge
                variant="outline"
                className="border-gray-200 bg-gray-100 text-xs text-gray-600"
              >
                Inactivo
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: "Importe",
      meta: {
        label: "Importe",
      },
      cell: ({ row }) => {
        const order = row.original;
        return (
          <span className="font-semibold text-foreground">
            ${order.amount.toFixed(2)}
          </span>
        );
      },
    },
    {
      id: "type",
      accessorKey: "orderType",
      header: "Tipo",
      meta: {
        label: "Tipo",
      },
      cell: ({ row }) => {
        const order = row.original;
        const orderType = orderTypeConfig[order.orderType];
        const TypeIcon = orderType.icon;

        return (
          <div className="flex items-center gap-2">
            <TypeIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{orderType.label}</span>
          </div>
        );
      },
    },
    {
      id: "payment",
      accessorKey: "paymentMethod",
      header: "Pago",
      meta: {
        label: "Pago",
      },
      cell: ({ row }) => {
        const order = row.original;
        return (
          <span className="text-sm text-muted-foreground">
            {paymentMethodConfig[order.paymentMethod]}
          </span>
        );
      },
    },
    {
      id: "date",
      accessorKey: "orderDate",
      header: "Fecha",
      meta: {
        label: "Fecha",
      },
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="text-sm">
            <p className="text-foreground">
              {new Date(order.orderDate).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(order.orderDate).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        );
      },
    },
    {
      id: "customer",
      accessorFn: (order) => order.customer?.name ?? "",
      header: "Cliente",
      meta: {
        label: "Cliente",
      },
      cell: ({ row }) => {
        const order = row.original;

        if (!order.customer) {
          return (
            <span className="text-sm italic text-muted-foreground">
              Sin cliente
            </span>
          );
        }

        return (
          <Tooltip>
            <TooltipTrigger render={<div />} className="cursor-help">
              <p className="max-w-30 truncate text-sm font-medium text-foreground">
                {order.customer.name}
              </p>
              {order.customer.phone && (
                <p className="text-xs text-muted-foreground">
                  {order.customer.phone}
                </p>
              )}
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="font-medium">{order.customer.name}</p>
              {order.customer.phone && (
                <p className="text-muted-foreground">
                  Tel: {order.customer.phone}
                </p>
              )}
              {order.customer.address && (
                <p className="text-muted-foreground">
                  {order.customer.address}
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      id: "user",
      accessorFn: (order) => order.user?.name ?? "",
      header: "Responsable",
      meta: {
        label: "Responsable",
      },
      cell: ({ row }) => {
        const order = row.original;

        if (!order.user) {
          return (
            <span className="text-sm italic text-muted-foreground">
              Sin usuario
            </span>
          );
        }

        return (
          <div className="text-sm">
            <p className="font-medium text-foreground">{order.user.name}</p>
            <p className="text-xs text-muted-foreground">{order.user.email}</p>
          </div>
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
        const order = row.original;

        return (
          <DataTableRowActions>
            <DropdownMenuItem
              className="gap-2"
              onClick={() => onViewDetails(order)}
            >
              <Eye className="h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={() => onEdit(order)}>
              <Pencil className="h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {order.isActive ? (
              <DropdownMenuItem
                className="gap-2 text-destructive focus:text-destructive"
                onClick={() => onDeactivate(order.id)}
              >
                <PowerOff className="h-4 w-4" />
                Desactivar
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="gap-2 text-green-600 focus:text-green-600"
                onClick={() => onActivate(order.id)}
              >
                <Power className="h-4 w-4" />
                Reactivar
              </DropdownMenuItem>
            )}
          </DataTableRowActions>
        );
      },
    },
  ];

  const selectionActions: DataTableSelectionAction<OrderRow>[] = [
    {
      key: "activate",
      label: "Reactivar seleccionadas",
      onClick: (context) => {
        const orderIds = context.selectedData
          .filter((order) => !order.isActive)
          .map((order) => order.id);

        if (!orderIds.length) {
          return;
        }

        if (onActivateMany) {
          onActivateMany(orderIds);
        } else {
          orderIds.forEach((orderId) => onActivate(orderId));
        }

        context.closeSelectionMode();
      },
      disabled: (context) =>
        !context.selectedData.some((order) => !order.isActive),
    },
    {
      key: "deactivate",
      label: "Desactivar seleccionadas",
      variant: "destructive",
      onClick: (context) => {
        const orderIds = context.selectedData
          .filter((order) => order.isActive)
          .map((order) => order.id);

        if (!orderIds.length) {
          return;
        }

        if (onDeactivateMany) {
          onDeactivateMany(orderIds);
        } else {
          orderIds.forEach((orderId) => onDeactivate(orderId));
        }

        context.closeSelectionMode();
      },
      disabled: (context) =>
        !context.selectedData.some((order) => order.isActive),
    },
  ];

  return (
    <TooltipProvider>
      <DataTable
        columns={columns}
        data={orders}
        pagination={{
          initialPageSize: 10,
          pageSizeOptions: [10, 20, 50],
        }}
        getRowClassName={(row) =>
          cn("group", !row.original.isActive && "opacity-60")
        }
        getRowId={(order) => order.id}
        selection={{
          bulkActions: selectionActions,
          getContextMenuContent: (row) => {
            const order = row.original;

            return (
              <>
                <ContextMenuItem onClick={() => onViewDetails(order)}>
                  <Eye className="h-4 w-4" />
                  Ver detalles
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onEdit(order)}>
                  <Pencil className="h-4 w-4" />
                  Editar
                </ContextMenuItem>
                <ContextMenuSeparator />
                {order.isActive ? (
                  <ContextMenuItem
                    variant="destructive"
                    onClick={() => onDeactivate(order.id)}
                  >
                    <PowerOff className="h-4 w-4" />
                    Desactivar
                  </ContextMenuItem>
                ) : (
                  <ContextMenuItem onClick={() => onActivate(order.id)}>
                    <Power className="h-4 w-4" />
                    Reactivar
                  </ContextMenuItem>
                )}
              </>
            );
          },
        }}
      />
    </TooltipProvider>
  );
}
