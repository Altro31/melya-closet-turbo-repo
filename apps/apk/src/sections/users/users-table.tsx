"use client";

import { DataTable } from "@/components/ui/data-table";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { LocalRowBadge, isLocalRow } from "@/components/ui/local-row-badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { userDetailsDialog } from "@/sections/users/user-details-dialog";
import { useUsers } from "@/sections/users/hooks/use-users";
import type { UsersFilters } from "@/sections/users/hooks/use-users-filters";
import { Eye, Pencil, Trash2, UserRound } from "lucide-react";

type UserRow = ReturnType<typeof useUsers>["data"][number];

interface UsersTableProps {
  filters: UsersFilters;
  onEdit: (user: UserRow) => void;
  onDelete: (user: UserRow) => void;
}

export function UsersTable({ filters, onEdit, onDelete }: UsersTableProps) {
  const { data: users } = useUsers(filters);

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <UserRound className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">
          No se encontraron usuarios
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          No hay usuarios que coincidan con los filtros seleccionados.
        </p>
      </div>
    );
  }

  const columns: ColumnDef<UserRow>[] = [
    {
      id: "user",
      accessorKey: "name",
      header: "Usuario",
      meta: {
        label: "Usuario",
        cellClassName: "font-medium",
      },
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex flex-wrap items-center gap-2">
            <span>{user.name}</span>
            <LocalRowBadge isLocal={isLocalRow(user)} />
          </div>
        );
      },
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
      meta: {
        label: "Email",
      },
      cell: ({ row }) => row.original.email,
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: "Teléfono",
      meta: {
        label: "Teléfono",
      },
      cell: ({ row }) => row.original.phone,
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
        const user = row.original;

        return (
          <DataTableRowActions>
            <DropdownMenuItem
              className="gap-2"
              onClick={() => userDetailsDialog.openWithPayload({ user })}
            >
              <Eye className="h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onClick={() => onEdit(user)}>
              <Pencil className="h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive"
              onClick={() => onDelete(user)}
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
      data={users}
      pagination={{
        initialPageSize: 10,
        pageSizeOptions: [10, 20, 50],
      }}
      getRowClassName="group"
      getRowId={(user) => user.id}
      selection={{}}
    />
  );
}
