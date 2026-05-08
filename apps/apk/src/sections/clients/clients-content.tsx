"use client";

import {
  createClientAction,
  deleteClientAction,
  updateClientAction,
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
import { useClients } from "@/sections/clients/hooks/use-clients";
import { useClientsFilters } from "@/sections/clients/hooks/use-clients-filters";
import { MapPin, Phone, Plus, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AddClientDialog } from "./add-client-dialog";
import { ClientDetailsDialog } from "./client-details-dialog";
import { ClientsFilters } from "./clients-filters";
import { ClientsTable } from "./clients-table";
import { EditClientDialog } from "./edit-client-dialog";

type ClientRow = ReturnType<typeof useClients>["data"][number];

export default function ClientsContent() {
  const [filters, setFilters] = useClientsFilters();
  const { data: clients } = useClients(filters);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientRow | null>(null);

  const resetDialogs = () => {
    setAddOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setSelectedClient(null);
  };

  const handleAddClient = (data: {
    name?: string;
    phone?: string;
    address?: string;
    details: string;
  }) => {
    createClientAction({
      id: crypto.randomUUID(),
      name: data.name,
      phone: data.phone,
      address: data.address,
      details: data.details,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    toast.success("Cliente creado correctamente");
    resetDialogs();
  };

  const handleEditClient = (changes: {
    name?: string;
    phone?: string;
    address?: string;
    details: string;
  }) => {
    if (!selectedClient) return;
    updateClientAction([selectedClient.id, changes]);
    toast.success("Cliente actualizado correctamente");
    resetDialogs();
  };

  const handleDeleteClient = () => {
    if (!selectedClient) return;
    deleteClientAction(selectedClient.id);
    toast.success("Cliente eliminado correctamente");
    resetDialogs();
  };

  const handleClearFilters = () => {
    setFilters({ search: null });
  };

  const totalClients = clients.length;
  const withPhone = clients.filter((c) => Boolean(c.phone)).length;
  const withAddress = clients.filter((c) => Boolean(c.address)).length;
  const cards = [
    {
      title: "Total Clientes",
      value: totalClients,
      description: "clientes registrados",
      Icon: UserRound,
      mediaClassName: "bg-primary/10 text-primary",
    },
    {
      title: "Con Teléfono",
      value: withPhone,
      description: "clientes con teléfono",
      Icon: Phone,
      mediaClassName: "bg-green-100 text-green-600",
    },
    {
      title: "Con Dirección",
      value: withAddress,
      description: "clientes con dirección",
      Icon: MapPin,
      mediaClassName: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      <ClientDetailsDialog />

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
              Listado de Clientes
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {clients.length} clientes
            </p>
          </div>
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Cliente
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <ClientsFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
          />
          <ClientsTable
            filters={filters}
            onEdit={(client) => {
              setSelectedClient(client);
              setEditOpen(true);
            }}
            onDelete={(client) => {
              setSelectedClient(client);
              setDeleteOpen(true);
            }}
          />
        </CardContent>
      </Card>

      <AddClientDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAddClient={handleAddClient}
      />

      <EditClientDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onEditClient={handleEditClient}
        client={selectedClient}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Cliente</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar a{" "}
              <span className="font-semibold">
                {selectedClient?.name || "este cliente"}
              </span>
              ? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose render={<Button variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteClient}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
