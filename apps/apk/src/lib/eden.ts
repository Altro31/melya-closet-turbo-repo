import { treaty } from "@elysia/eden";
import type { BaleCategory } from "@/types/bale-category";
import type { Bale } from "@/types/bale";
import type { Client } from "@/types/client";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import type { User } from "@/types/user";

export const client = treaty(
	process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://localhost:3000",
) as any;

async function unwrap<TData>(request: Promise<{ data: TData; error: unknown }>) {
	const { data, error } = await request;

	if (error) {
		throw error;
	}

	return data;
}

function createCrudClient<TModel>(resource: {
	post: (body: TModel) => Promise<{ data: TModel; error: unknown }>;
	byId: (id: string) => {
		patch: (body: Partial<TModel>) => Promise<{ data: TModel; error: unknown }>;
		delete: () => Promise<{ data: TModel; error: unknown }>;
	};
}) {
	return {
		create: {
			mutate: (input: TModel) => unwrap(resource.post(input)),
		},
		update: {
			mutate: ([id, changes]: [string, Partial<TModel>]) =>
				unwrap(resource.byId(id).patch(changes)),
		},
		delete: {
			mutate: (id: string) => unwrap(resource.byId(id).delete()),
		},
	};
}

export const eden = {
	bale: createCrudClient<Bale>({
		post: (body) => client.api.bales.post(body),
		byId: (id) => client.api.bales({ id }),
	}),
	baleCategories: createCrudClient<BaleCategory>({
		post: (body) => client.api["bale-categories"].post(body),
		byId: (id) => client.api["bale-categories"]({ id }),
	}),
	client: createCrudClient<Client>({
		post: (body) => client.api.clients.post(body),
		byId: (id) => client.api.clients({ id }),
	}),
	order: createCrudClient<Order>({
		post: (body) => client.api.orders.post(body),
		byId: (id) => client.api.orders({ id }),
	}),
	product: createCrudClient<Product>({
		post: (body) => client.api.products.post(body),
		byId: (id) => client.api.products({ id }),
	}),
	user: createCrudClient<User>({
		post: (body) => client.api.users.post(body),
		byId: (id) => client.api.users({ id }),
	}),
};
