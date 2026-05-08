"use client";

import {
  createUserAction,
  deleteUserAction,
  updateUserAction,
} from "@/lib/collections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUsers } from "@/sections/users/hooks/use-users";
import { useUsersFilters } from "@/sections/users/hooks/use-users-filters";
import { Mail, Phone, Plus, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AddUserDialog } from "./add-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { UserDetailsDialog } from "./user-details-dialog";
import { UsersFilters } from "./users-filters";
import { UsersTable } from "./users-table";

type UserRow = ReturnType<typeof useUsers>["data"][number];

export default function UsersContent() {
  const [filters, setFilters] = useUsersFilters();
  const { data: users } = useUsers(filters);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  const resetDialogs = () => {
    setAddOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setSelectedUser(null);
  };

  const handleAddUser = (data: {
    name: string;
    email: string;
    phone: string;
  }) => {
    const duplicated = users.some(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (duplicated) {
      toast.error("Ya existe un usuario con ese email");
      return;
    }

    createUserAction({
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    toast.success("Usuario creado correctamente");
    resetDialogs();
  };

  const handleEditUser = (changes: {
    name: string;
    email: string;
    phone: string;
  }) => {
    if (!selectedUser) return;
    const duplicated = users.some(
      (u) =>
        u.id !== selectedUser.id &&
        u.email.toLowerCase() === changes.email.toLowerCase()
    );
    if (duplicated) {
      toast.error("Ya existe un usuario con ese email");
      return;
    }

    updateUserAction([selectedUser.id, changes]);
    toast.success("Usuario actualizado correctamente");
    resetDialogs();
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    deleteUserAction(selectedUser.id);
    toast.success("Usuario eliminado correctamente");
    resetDialogs();
  };

  const handleClearFilters = () => {
    setFilters({ search: null });
  };

  const totalUsers = users.length;
  const totalWithEmail = users.filter((u) => Boolean(u.email)).length;
  const totalWithPhone = users.filter((u) => Boolean(u.phone)).length;
  const cards = [
    {
      title: "Total Usuarios",
      value: totalUsers,
      description: "usuarios registrados",
      Icon: UserRound,
      mediaClassName: "bg-primary/10 text-primary",
    },
    {
      title: "Con Email",
      value: totalWithEmail,
      description: "usuarios con correo",
      Icon: Mail,
      mediaClassName: "bg-green-100 text-green-600",
    },
    {
      title: "Con Teléfono",
      value: totalWithPhone,
      description: "usuarios con teléfono",
      Icon: Phone,
      mediaClassName: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      <UserDetailsDialog />

      <DataCardGroud className="xs:grid-cols-2 md:grid-cols-3">
        {cards.map(({ Icon, description, mediaClassName, title, value }) => (
          <DataCard key={title}>
            <DataCardHeader>
              <DataCardTitle>{title}</DataCardTitle>
              <DataCardMedia className={mediaClassName}>
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

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Listado de Usuarios
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {users.length} usuarios
            </p>
          </div>
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Usuario
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <UsersFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
          />
          <UsersTable
            filters={filters}
            onEdit={(user) => {
              setSelectedUser(user);
              setEditOpen(true);
            }}
            onDelete={(user) => {
              setSelectedUser(user);
              setDeleteOpen(true);
            }}
          />
        </CardContent>
      </Card>

      <AddUserDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAddUser={handleAddUser}
      />

      <EditUserDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onEditUser={handleEditUser}
        user={selectedUser}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Usuario</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar a{" "}
              <span className="font-semibold">{selectedUser?.name}</span>? Esta
              acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose render={<Button variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
