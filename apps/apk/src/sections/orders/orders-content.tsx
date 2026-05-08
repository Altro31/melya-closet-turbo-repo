"use client";

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
import { createOrderAction, updateOrderAction } from "@/lib/collections";
import { useClients } from "@/sections/clients/hooks/use-clients";
import { useUsers } from "@/sections/users/hooks/use-users";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AddOrderDialog } from "./add-order-dialog";
import { EditOrderDialog } from "./edit-order-dialog";
import { type OrderRow, useOrders } from "./hooks/use-orders";
import { useOrdersFilters } from "./hooks/use-orders-filters";
import { OrderDetailsDialog } from "./order-details-dialog";
import { type OrderFormValues } from "./order-types";
import { OrdersFilters } from "./orders-filters";
import { OrdersTable } from "./orders-table";

export { orderStatuses, orderTypes, paymentMethods } from "./order-types";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface Order {
  id: string;
  status: "pendiente" | "en_proceso" | "completado" | "cancelado";
  isActive: boolean;
  amount: number;
  orderType: "tienda" | "online" | "mayoreo";
  paymentMethod: "efectivo" | "tarjeta" | "transferencia" | "mixto";
  orderDate: string;
  hasDelivery: boolean;
  deliveryAddress?: string;
  deliveryFee?: number;
  customer?: {
    name: string;
    phone?: string;
    email?: string;
  };
  details?: string;
  items: OrderItem[];
}

export default function OrdersContent() {
  const [filters, setFilters] = useOrdersFilters();
  const { data: filteredOrders, allOrders } = useOrders(filters);
  const { data: clients = [] } = useClients();
  const { data: users = [] } = useUsers();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder =
    allOrders.find((order) => order.id === selectedOrderId) ?? null;

  const clientOptions = clients.map((client) => ({
    id: client.id,
    name: client.name ?? "Sin nombre",
    description: client.phone || client.address || undefined,
  }));
  const userOptions = users.map((user) => ({
    id: user.id,
    name: user.name ?? "Sin nombre",
    description: user.email || user.phone,
  }));

  const closeDialogs = () => {
    setAddDialogOpen(false);
    setEditDialogOpen(false);
    setDetailsDialogOpen(false);
    setSelectedOrderId(null);
  };

  const handleAddOrder = (data: OrderFormValues) => {
    if (!data.userId) {
      toast.error("Selecciona un usuario responsable");
      return;
    }

    createOrderAction({
      id: crypto.randomUUID(),
      status: data.status,
      type: data.orderType,
      paymentType: data.paymentMethod,
      details: data.details.trim(),
      clientId: data.clientId || null,
      userId: data.userId,
      totalPrice: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    toast.success("Pedido creado correctamente");
    closeDialogs();
  };

  const handleEditOrder = (orderId: string, changes: OrderFormValues) => {
    updateOrderAction([
      orderId,
      {
        status: changes.status,
        type: changes.orderType,
        paymentType: changes.paymentMethod,
        details: changes.details.trim(),
        clientId: changes.clientId || null,
        userId: changes.userId,
      },
    ]);

    toast.success("Pedido actualizado correctamente");
    closeDialogs();
  };

  const handleDeactivateOrder = (orderId: string) => {
    updateOrderAction([orderId, { status: "cancelado" }]);
    toast.success("Pedido cancelado correctamente");
  };

  const handleDeactivateOrders = (orderIds: string[]) => {
    orderIds.forEach((orderId) => {
      updateOrderAction([orderId, { status: "cancelado" }]);
    });
    toast.success(
      orderIds.length === 1
        ? "Pedido cancelado correctamente"
        : "Pedidos cancelados correctamente"
    );
  };

  const handleActivateOrder = (orderId: string) => {
    updateOrderAction([orderId, { status: "pendiente" }]);
    toast.success("Pedido reactivado correctamente");
  };

  const handleActivateOrders = (orderIds: string[]) => {
    orderIds.forEach((orderId) => {
      updateOrderAction([orderId, { status: "pendiente" }]);
    });
    toast.success(
      orderIds.length === 1
        ? "Pedido reactivado correctamente"
        : "Pedidos reactivados correctamente"
    );
  };

  const handleViewDetails = (order: OrderRow) => {
    setSelectedOrderId(order.id);
    setDetailsDialogOpen(true);
  };

  const handleEditClick = (order: OrderRow) => {
    setSelectedOrderId(order.id);
    setEditDialogOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({
      search: null,
      status: null,
      orderType: null,
      paymentMethod: null,
      isActive: null,
      dateFrom: null,
      dateTo: null,
      minAmount: null,
      maxAmount: null,
    });
  };

  const totalOrders = allOrders.length;
  const activeOrders = allOrders.filter((order) => order.isActive).length;
  const pendingOrders = allOrders.filter(
    (order) => order.status === "pendiente"
  ).length;
  const totalRevenue = allOrders
    .filter((order) => order.status === "completado" && order.isActive)
    .reduce((accumulator, order) => accumulator + order.amount, 0);
  const completedOrders = allOrders.filter(
    (order) => order.status === "completado"
  ).length;
  const cards = [
    {
      title: "Total Pedidos",
      value: totalOrders,
      description: `${activeOrders} activos`,
      Icon: ShoppingBag,
      mediaClassName: "bg-primary/10 text-primary",
    },
    {
      title: "Ingresos Completados",
      value: `$${totalRevenue.toFixed(2)}`,
      description: "total calculado por productos sincronizados",
      Icon: DollarSign,
      mediaClassName: "bg-green-100 text-green-600",
    },
    {
      title: "Pendientes",
      value: pendingOrders,
      description: "pedidos por procesar",
      Icon: Clock,
      mediaClassName: "bg-amber-100 text-amber-600",
    },
    {
      title: "Completados",
      value: completedOrders,
      description: "pedidos entregados",
      Icon: CheckCircle,
      mediaClassName: "bg-accent/10 text-accent",
    },
  ];

  return (
    <div className="space-y-6">
      <DataCardGroud className="xs:grid-cols-2 md:grid-cols-4">
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
              Listado de Pedidos
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {filteredOrders.length} de {totalOrders} pedidos
            </p>
          </div>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="gap-2"
            disabled={userOptions.length === 0}
          >
            <Plus className="h-4 w-4" />
            Nuevo Pedido
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <OrdersFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
          />

          <OrdersTable
            orders={filteredOrders}
            onViewDetails={handleViewDetails}
            onEdit={handleEditClick}
            onDeactivate={handleDeactivateOrder}
            onActivate={handleActivateOrder}
            onDeactivateMany={handleDeactivateOrders}
            onActivateMany={handleActivateOrders}
          />
        </CardContent>
      </Card>

      <AddOrderDialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) setSelectedOrderId(null);
        }}
        onAddOrder={handleAddOrder}
        clients={clientOptions}
        users={userOptions}
      />

      {selectedOrder && (
        <>
          <EditOrderDialog
            open={editDialogOpen}
            onOpenChange={(open) => {
              setEditDialogOpen(open);
              if (!open) setSelectedOrderId(null);
            }}
            order={selectedOrder}
            onSave={handleEditOrder}
            clients={clientOptions}
            users={userOptions}
          />

          <OrderDetailsDialog
            open={detailsDialogOpen}
            onOpenChange={(open) => {
              setDetailsDialogOpen(open);
              if (!open) setSelectedOrderId(null);
            }}
            order={selectedOrder}
          />
        </>
      )}
    </div>
  );
}
