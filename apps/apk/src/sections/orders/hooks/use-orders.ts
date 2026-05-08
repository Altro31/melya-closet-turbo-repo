import { orderCollection } from "@/lib/collections";
import { useClients } from "@/sections/clients/hooks/use-clients";
import type { OrderFilters } from "@/sections/orders/hooks/use-orders-filters";
import { useUsers } from "@/sections/users/hooks/use-users";
import type {
  OrderStatus,
  OrderType,
  PaymentMethod,
} from "@/sections/orders/order-types";
import { useLiveQuery } from "@tanstack/react-db";

export interface OrderRow {
  id: string;
  status: OrderStatus;
  isActive: boolean;
  amount: number;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  orderDate: string;
  details: string;
  clientId: string | null | undefined;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  $synced?: boolean;
  customer?: {
    id: string;
    name: string;
    phone?: string;
    address?: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export function useOrders(filters: OrderFilters) {
  const { data: orders = [] } = useLiveQuery((q) =>
    q
      .from({ order: orderCollection })
      .orderBy(({ order }) => order.createdAt, "desc")
  );
  const { data: clients = [] } = useClients();
  const { data: users = [] } = useUsers();

  const clientsById = new Map(clients.map((client) => [client.id, client]));
  const usersById = new Map(users.map((user) => [user.id, user]));

  const allOrders: OrderRow[] = orders.map((order) => {
    const client = order.clientId ? clientsById.get(order.clientId) : undefined;
    const user = usersById.get(order.userId);

    return {
      id: order.id,
      status: order.status as OrderStatus,
      isActive: order.status !== "cancelado",
      amount: typeof order.totalPrice === "number" ? order.totalPrice : 0,
      orderType: order.type as OrderType,
      paymentMethod: order.paymentType as PaymentMethod,
      orderDate: new Date(order.createdAt).toISOString(),
      details: order.details ?? "",
      clientId: order.clientId,
      userId: order.userId,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt ?? order.createdAt),
      $synced: order.$synced,
      customer: client
        ? {
            id: client.id,
            name: client.name ?? "Sin nombre",
            phone: client.phone ?? undefined,
            address: client.address ?? undefined,
          }
        : undefined,
      user: user
        ? {
            id: user.id,
            name: user.name ?? "Sin nombre",
            email: user.email ?? "",
            phone: user.phone ?? "",
          }
        : undefined,
    };
  });

  const data = allOrders.filter((order) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesId = order.id.toLowerCase().includes(searchLower);
      const matchesCustomer = order.customer?.name.toLowerCase().includes(searchLower);
      const matchesUser = order.user?.name.toLowerCase().includes(searchLower);
      const matchesDetails = order.details?.toLowerCase().includes(searchLower);
      if (!matchesId && !matchesCustomer && !matchesUser && !matchesDetails) {
        return false;
      }
    }

    if (filters.status && order.status !== filters.status) return false;
    if (filters.orderType && order.orderType !== filters.orderType) return false;
    if (filters.paymentMethod && order.paymentMethod !== filters.paymentMethod) {
      return false;
    }

    if (filters.isActive === "active" && !order.isActive) return false;
    if (filters.isActive === "inactive" && order.isActive) return false;

    if (filters.dateFrom) {
      const orderDate = new Date(order.orderDate);
      const fromDate = new Date(filters.dateFrom);
      if (orderDate < fromDate) return false;
    }
    if (filters.dateTo) {
      const orderDate = new Date(order.orderDate);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      if (orderDate > toDate) return false;
    }

    if (filters.minAmount && order.amount < parseFloat(filters.minAmount)) {
      return false;
    }
    if (filters.maxAmount && order.amount > parseFloat(filters.maxAmount)) {
      return false;
    }

    return true;
  });

  return { data, allOrders };
}

