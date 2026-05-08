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
