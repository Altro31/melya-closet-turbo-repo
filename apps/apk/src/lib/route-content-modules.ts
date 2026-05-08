export const loadBaleCategoriesContent = () =>
  import("@/sections/bale-categories/bale-categories-content");

export const loadClientLogsContent = () =>
  import("@/sections/client-logs/client-logs-content");

export const loadClientsContent = () =>
  import("@/sections/clients/clients-content");

export const loadInventoryContent = () =>
  import("@/sections/inventory/inventory-content");

export const loadOrdersContent = () =>
  import("@/sections/orders/orders-content");

export const loadProductsContent = () =>
  import("@/sections/products/products-content");

export const loadUserLogsContent = () =>
  import("@/sections/user-logs/user-logs-content");

export const loadUsersContent = () => import("@/sections/users/users-content");

export const routeContentLoaders = [
  loadBaleCategoriesContent,
  // loadClientLogsContent,
  // loadClientsContent,
  // loadInventoryContent,
  // loadOrdersContent,
  // loadProductsContent,
  // loadUserLogsContent,
  // loadUsersContent,
];
