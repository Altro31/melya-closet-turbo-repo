import { createElectricCollection } from "@/lib/electric";
import { apiClient } from "@/lib/api-client";
import { applyChanges } from "@/lib/mutation";
import { factory } from "@/lib/zod";

import type { Bale } from "@/types/bale";
import type { Client } from "@/types/client";
import type { ClientLog } from "@/types/client-log";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import type { User } from "@/types/user";
import type { UserLog } from "@/types/user-log";
import { startOfflineExecutor } from "@tanstack/offline-transactions";
import type z from "zod";

export type BaleCategory = z.infer<typeof BaleCategory>;
export const BaleCategory = factory.makeModelSchema("Category");

export const baleCategoryCollection = createElectricCollection<BaleCategory>({
  id: "baleCategories",
  table: "category",
});

export const baleCollection = createElectricCollection<Bale>({
  id: "bales",
  table: "bale",
});

export const clientLogCollection = createElectricCollection<ClientLog>({
  id: "clientLogs",
  table: "client_log",
});

export const clientCollection = createElectricCollection<Client>({
  id: "clients",
  table: "client",
});

export const orderCollection = createElectricCollection<Order>({
  id: "orders",
  table: "order",
});

export const userLogCollection = createElectricCollection<UserLog>({
  id: "userLogs",
  table: "user_log",
});

export const productCollection = createElectricCollection<Product>({
  id: "products",
  table: "product",
});

export const userCollection = createElectricCollection<User>({
  id: "users",
  table: "user",
});

export const preloadedCollections = [
  {
    id: "baleCategories",
    label: "Categorias",
    collection: baleCategoryCollection,
  },
  { id: "bales", label: "Pacas", collection: baleCollection },
  {
    id: "clientLogs",
    label: "Logs de clientes",
    collection: clientLogCollection,
  },
  { id: "clients", label: "Clientes", collection: clientCollection },
  { id: "orders", label: "Pedidos", collection: orderCollection },
  { id: "products", label: "Productos", collection: productCollection },
  { id: "userLogs", label: "Logs de usuarios", collection: userLogCollection },
  { id: "users", label: "Usuarios", collection: userCollection },
] as const;

const offline = startOfflineExecutor({
  collections: {
    baleCategories: baleCategoryCollection,
    clientLogs: clientLogCollection,
    bales: baleCollection,
    clients: clientCollection,
    orders: orderCollection,
    products: productCollection,
    userLogs: userLogCollection,
    users: userCollection,
  },
  mutationFns: {
    async createClient({ transaction }) {
      const newItem = transaction.mutations[0].modified as Client;
      await apiClient.client.create.mutate(newItem);
    },
    async updateClient({ transaction }) {
      const mutation = transaction.mutations[0];
      const id = mutation.key as string;
      const changes = mutation.changes as Partial<Client>;
      await apiClient.client.update.mutate([id, changes]);
    },
    async deleteClient({ transaction }) {
      const id: string = transaction.mutations[0].key;
      await apiClient.client.delete.mutate(id);
    },

    async createUser({ transaction }) {
      const newItem = transaction.mutations[0].modified as User;
      await apiClient.user.create.mutate(newItem);
    },
    async updateUser({ transaction }) {
      const mutation = transaction.mutations[0];
      const id = mutation.key as string;
      const changes = mutation.changes as Partial<User>;
      await apiClient.user.update.mutate([id, changes]);
    },
    async deleteUser({ transaction }) {
      const id: string = transaction.mutations[0].key;
      await apiClient.user.delete.mutate(id);
    },

    async createProduct({ transaction }) {
      const newItem = transaction.mutations[0].modified as Product;
      await apiClient.product.create.mutate(newItem);
    },
    async updateProduct({ transaction }) {
      const mutation = transaction.mutations[0];
      const id = mutation.key as string;
      const changes = mutation.changes as Partial<Product>;
      await apiClient.product.update.mutate([id, changes]);
    },
    async deleteProduct({ transaction }) {
      const id: string = transaction.mutations[0].key;
      await apiClient.product.delete.mutate(id);
    },

    async createOrder({ transaction }) {
      const newItem = transaction.mutations[0].modified as Order;
      await apiClient.order.create.mutate(newItem);
    },
    async updateOrder({ transaction }) {
      const mutation = transaction.mutations[0];
      const id = mutation.key as string;
      const changes = mutation.changes as Partial<Order>;
      await apiClient.order.update.mutate([id, changes]);
    },
    async deleteOrder({ transaction }) {
      const id: string = transaction.mutations[0].key;
      await apiClient.order.delete.mutate(id);
    },

    async createBaleCategory({ transaction }) {
      const newItem = transaction.mutations[0].modified as BaleCategory;
      await apiClient.baleCategories.create.mutate(newItem);
    },
    async updateBaleCategory({ transaction }) {
      const mutation = transaction.mutations[0];
      const id = mutation.key as string;
      const changes = mutation.changes as Partial<BaleCategory>;
      await apiClient.baleCategories.update.mutate([id, changes]);
    },
    async deleteBaleCategory({ transaction }) {
      const id: string = transaction.mutations[0].key;
      await apiClient.baleCategories.delete.mutate(id);
    },

    async createBale({ transaction }) {
      const newItem = transaction.mutations[0].modified as Bale;
      await apiClient.bale.create.mutate(newItem);
    },
    async updateBale({ transaction }) {
      const mutation = transaction.mutations[0];
      const id = mutation.key as string;
      const changes = mutation.changes as Partial<Bale>;
      await apiClient.bale.update.mutate([id, changes]);
    },
    async deleteBale({ transaction }) {
      const id: string = transaction.mutations[0].key;
      await apiClient.bale.delete.mutate(id);
    },
  },
});

await offline.waitForInit();

export const createClientAction = offline.createOfflineAction<Client>({
  mutationFnName: "createClient",
  onMutate(client) {
    clientCollection.insert(client);
  },
});

export const updateClientAction = offline.createOfflineAction<
  [string, Partial<Client>]
>({
  mutationFnName: "updateClient",
  onMutate([id, changes]) {
    clientCollection.update(id, (draft) => applyChanges(draft, changes));
  },
});

export const deleteClientAction = offline.createOfflineAction<string>({
  mutationFnName: "deleteClient",
  onMutate(id) {
    clientCollection.delete(id);
  },
});

export const createUserAction = offline.createOfflineAction<User>({
  mutationFnName: "createUser",
  onMutate(user) {
    userCollection.insert(user);
  },
});

export const updateUserAction = offline.createOfflineAction<
  [string, Partial<User>]
>({
  mutationFnName: "updateUser",
  onMutate([id, changes]) {
    userCollection.update(id, (draft) => applyChanges(draft, changes));
  },
});

export const deleteUserAction = offline.createOfflineAction<string>({
  mutationFnName: "deleteUser",
  onMutate(id) {
    userCollection.delete(id);
  },
});

export const createProductAction = offline.createOfflineAction<Product>({
  mutationFnName: "createProduct",
  onMutate(product) {
    productCollection.insert(product);
  },
});

export const updateProductAction = offline.createOfflineAction<
  [string, Partial<Product>]
>({
  mutationFnName: "updateProduct",
  onMutate([id, changes]) {
    productCollection.update(id, (draft) => applyChanges(draft, changes));
  },
});

export const deleteProductAction = offline.createOfflineAction<string>({
  mutationFnName: "deleteProduct",
  onMutate(id) {
    productCollection.delete(id);
  },
});

export const createOrderAction = offline.createOfflineAction<Order>({
  mutationFnName: "createOrder",
  onMutate(order) {
    orderCollection.insert(order);
  },
});

export const updateOrderAction = offline.createOfflineAction<
  [string, Partial<Order>]
>({
  mutationFnName: "updateOrder",
  onMutate([id, changes]) {
    orderCollection.update(id, (draft) => applyChanges(draft, changes));
  },
});

export const deleteOrderAction = offline.createOfflineAction<string>({
  mutationFnName: "deleteOrder",
  onMutate(id) {
    orderCollection.delete(id);
  },
});

export const createBaleCategoryAction =
  offline.createOfflineAction<BaleCategory>({
    mutationFnName: "createBaleCategory",
    onMutate(category) {
      baleCategoryCollection.insert(category);
    },
  });

export const updateBaleCategoryAction = offline.createOfflineAction<
  [string, Partial<BaleCategory>]
>({
  mutationFnName: "updateBaleCategory",
  onMutate([id, changes]) {
    baleCategoryCollection.update(id, (draft) => applyChanges(draft, changes));
  },
});

export const deleteBaleCategoryAction = offline.createOfflineAction<string>({
  mutationFnName: "deleteBaleCategory",
  onMutate(id) {
    baleCategoryCollection.delete(id);
  },
});

export const createBaleAction = offline.createOfflineAction<Bale>({
  mutationFnName: "createBale",
  onMutate(bale) {
    baleCollection.insert(bale);
  },
});

export const updateBaleAction = offline.createOfflineAction<
  [string, Partial<Bale>]
>({
  mutationFnName: "updateBale",
  onMutate([id, changes]) {
    baleCollection.update(id, (draft) => applyChanges(draft, changes));
  },
});

export const deleteBaleAction = offline.createOfflineAction<string>({
  mutationFnName: "deleteBale",
  onMutate(id) {
    baleCollection.delete(id);
  },
});
