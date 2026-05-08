"use client";

import { DataTable } from "@/components/ui/data-table";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LocalRowBadge, isLocalRow } from "@/components/ui/local-row-badge";
import type { ColumnDef } from "@tanstack/react-table";
import { useUserLogs } from "@/sections/user-logs/hooks/use-user-logs";
import type { UserLogsFilters } from "@/sections/user-logs/hooks/use-user-logs-filters";
import { userLogDetailsDialog } from "@/sections/user-logs/user-log-details-dialog";
import { Eye, FileClock } from "lucide-react";

interface UserLogsTableProps {
  filters: UserLogsFilters;
}

type UserLogRow = ReturnType<typeof useUserLogs>["data"][number];

export function UserLogsTable({ filters }: UserLogsTableProps) {
  const { data: userLogs } = useUserLogs(filters);

  if (userLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <FileClock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">
          No se encontraron registros
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          No hay logs de usuario que coincidan con los filtros.
        </p>
      </div>
    );
  }

  const columns: ColumnDef<UserLogRow>[] = [
    {
      id: "action",
      accessorKey: "action",
      header: "Acción",
      meta: {
        label: "Acción",
        cellClassName: "font-medium",
      },
      cell: ({ row }) => {
        const log = row.original;

        return (
          <div className="flex flex-wrap items-center gap-2">
            <span>{log.action}</span>
            <LocalRowBadge isLocal={isLocalRow(log)} />
          </div>
        );
      },
    },
    {
      id: "user",
      accessorFn: (log) => log.User?.name || "",
      header: "Usuario",
      meta: {
        label: "Usuario",
      },
      cell: ({ row }) => row.original.User?.name || "Sin usuario",
    },
    {
      id: "details",
      accessorKey: "details",
      header: "Detalle",
      meta: {
        label: "Detalle",
        cellClassName: "max-w-75 truncate",
      },
      cell: ({ row }) => row.original.details,
    },
    {
      id: "date",
      accessorKey: "createdAt",
      header: "Fecha",
      meta: {
        label: "Fecha",
      },
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("es-ES"),
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
        const log = row.original;

        return (
          <DataTableRowActions>
            <DropdownMenuItem
              className="gap-2"
              onClick={() =>
                userLogDetailsDialog.openWithPayload({ userLog: log })
              }
            >
              <Eye className="h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
          </DataTableRowActions>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={userLogs}
      pagination={{
        initialPageSize: 10,
        pageSizeOptions: [10, 20, 50],
      }}
      getRowClassName="group"
      getRowId={(log) => log.id}
      selection={{}}
    />
  );
}
