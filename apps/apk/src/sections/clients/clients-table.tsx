"use client";

import { DataTable } from "@/components/ui/data-table";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { LocalRowBadge, isLocalRow } from "@/components/ui/local-row-badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { clientDetailsDialog } from "@/sections/clients/client-details-dialog";
import { useClients } from "@/sections/clients/hooks/use-clients";
import type { ClientsFilters } from "@/sections/clients/hooks/use-clients-filters";
import { Eye, Pencil, Trash2, UserRound } from "lucide-react";

type ClientRow = ReturnType<typeof useClients>["data"][number];

interface ClientsTableProps {
  filters: ClientsFilters;
  onEdit: (client: ClientRow) => void;
  onDelete: (client: ClientRow) => void;
}

export function ClientsTable({ filters, onEdit, onDelete }: ClientsTableProps) {
  const { data: clients } = useClients(filters);

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <UserRound className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">
          No se encontraron clientes
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          No hay clientes que coincidan con los filtros seleccionados.
        </p>
      </div>
    );
  }

  const columns: ColumnDef<ClientRow>[] = [
    {
      id: "client",
      accessorKey: "name",
      header: "Cliente",
      meta: {
        label: "Cliente",
        cellClassName: "font-medium",
      },
      cell: ({ row }) => {
        const client = row.original;

        return (
          <div className="flex flex-wrap items-center gap-2">
            <span>{client.name || "Sin nombre"}</span>
            <LocalRowBadge isLocal={isLocalRow(client)} />
          </div>
        );
      },
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: "Teléfono",
      meta: {
        label: "Teléfono",
      },
      cell: ({ row }) => row.original.phone || "-",
    },
    {
      id: "address",
      accessorKey: "address",
      header: "Dirección",
      meta: {
        label: "Dirección",
      },
      cell: ({ row }) => row.original.address || "-",
    },
    {
      id: "details",
      accessorKey: "details",
      header: "Detalles",
      meta: {
        label: "Detalles",
        cellClassName: "max-w-75 truncate",
      },
      cell: ({ row }) => row.original.details,
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
        const client = row.original;

        return (
          <DataTableRowActions>
            <DropdownMenuItem
              className="gap-2"
              onClick={() => clientDetailsDialog.openWithPayload({ client })}
            >
              <Eye className="h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={() => onEdit(client)}>
              <Pencil className="h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive"
              onClick={() => onDelete(client)}
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
      data={clients}
      pagination={{
        initialPageSize: 10,
        pageSizeOptions: [10, 20, 50],
      }}
      getRowClassName="group"
      getRowId={(client) => client.id}
      selection={{}}
    />
  );
}
