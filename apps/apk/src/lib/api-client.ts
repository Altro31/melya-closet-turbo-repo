import type { Bale } from "@/types/bale";
import type { BaleCategory } from "@/types/bale-category";
import type { Client } from "@/types/client";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import type { User } from "@/types/user";
import { Api } from "backend";
import { Effect } from "effect";
import { FetchHttpClient } from "effect/unstable/http";
import { HttpApiClient } from "effect/unstable/httpapi";

export const apiUrlBuilder = HttpApiClient.urlBuilder(Api, { baseUrl: process.env.NEXT_PUBLIC_API_URL });

const rawApiClient = HttpApiClient.make(Api, {
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
}).pipe(Effect.provide(FetchHttpClient.layer));

const apiClientPromise = Effect.runPromise(rawApiClient);

async function runRequest<TData>(
  request: (client: Awaited<typeof apiClientPromise>) => Effect.Effect<TData, unknown, never>,
) {
  const client = await apiClientPromise;
  return Effect.runPromise(request(client));
}

function createCrudClient<TModel>(resource: {
  create: (
    client: Awaited<typeof apiClientPromise>,
    input: TModel,
  ) => Effect.Effect<unknown, unknown, never>;
  update: (
    client: Awaited<typeof apiClientPromise>,
    id: string,
    changes: Partial<TModel>,
  ) => Effect.Effect<unknown, unknown, never>;
  delete: (
    client: Awaited<typeof apiClientPromise>,
    id: string,
  ) => Effect.Effect<unknown, unknown, never>;
}) {
  return {
    create: {
      mutate: (input: TModel) => runRequest((client) => resource.create(client, input)),
    },
    update: {
      mutate: ([id, changes]: [string, Partial<TModel>]) =>
        runRequest((client) => resource.update(client, id, changes)),
    },
    delete: {
      mutate: (id: string) => runRequest((client) => resource.delete(client, id)),
    },
  };
}

export const apiClient = {
  bale: createCrudClient<Bale>({
    create: (client, input) => client.bales.create({ payload: input }),
    update: (client, id, changes) => client.bales.update({ params: { id }, payload: changes }),
    delete: (client, id) => client.bales.delete({ params: { id } }),
  }),
  baleCategories: createCrudClient<BaleCategory>({
    create: (client, input) => client.baleCategories.create({ payload: input }),
    update: (client, id, changes) =>
      client.baleCategories.update({ params: { id }, payload: changes }),
    delete: (client, id) => client.baleCategories.delete({ params: { id } }),
  }),
  client: createCrudClient<Client>({
    create: (client, input) => client.clients.create({ payload: input }),
    update: (client, id, changes) => client.clients.update({ params: { id }, payload: changes }),
    delete: (client, id) => client.clients.delete({ params: { id } }),
  }),
  order: createCrudClient<Order>({
    create: (client, input) => client.orders.create({ payload: input }),
    update: (client, id, changes) => client.orders.update({ params: { id }, payload: changes }),
    delete: (client, id) => client.orders.delete({ params: { id } }),
  }),
  product: createCrudClient<Product>({
    create: (client, input) => client.products.create({ payload: input }),
    update: (client, id, changes) => client.products.update({ params: { id }, payload: changes }),
    delete: (client, id) => client.products.delete({ params: { id } }),
  }),
  user: createCrudClient<User>({
    create: (client, input) => client.users.create({ payload: input }),
    update: (client, id, changes) => client.users.update({ params: { id }, payload: changes }),
    delete: (client, id) => client.users.delete({ params: { id } }),
  }),
};
