export const orderStatuses = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en_proceso", label: "En Proceso" },
  { value: "completado", label: "Completado" },
  { value: "cancelado", label: "Cancelado" },
] as const;

export const orderTypes = [
  { value: "tienda", label: "Tienda" },
  { value: "online", label: "Online" },
  { value: "mayoreo", label: "Mayoreo" },
] as const;

export const paymentMethods = [
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta", label: "Tarjeta" },
  { value: "transferencia", label: "Transferencia" },
  { value: "mixto", label: "Mixto" },
] as const;

export type OrderStatus = (typeof orderStatuses)[number]["value"];
export type OrderType = (typeof orderTypes)[number]["value"];
export type PaymentMethod = (typeof paymentMethods)[number]["value"];

export interface OrderFormValues {
  status: OrderStatus;
  orderType: OrderType | "";
  paymentMethod: PaymentMethod | "";
  clientId: string;
  userId: string;
  details: string;
}

export interface OrderPartyOption {
  id: string;
  name: string;
  description?: string;
}