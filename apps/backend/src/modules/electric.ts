import { Elysia } from "elysia";

const ELECTRIC_PROTOCOL_QUERY_PARAMS = new Set([
	"live",
	"live_sse",
	"experimental_live_sse",
	"handle",
	"offset",
	"cursor",
	"expired_handle",
	"log",
	"subset__where",
	"subset__limit",
	"subset__offset",
	"subset__order_by",
	"subset__params",
	"subset__where_expr",
	"subset__order_by_expr",
	"cache-buster",
]);

function buildElectricShapeUrl(requestUrl: string) {
	const electricUrl = process.env.ELECTRIC_URL;

	if (!electricUrl) {
		throw new Error("Missing ELECTRIC_URL");
	}

	const incomingUrl = new URL(requestUrl);
	const originUrl = new URL("/v1/shape", electricUrl.endsWith("/") ? electricUrl : `${electricUrl}/`);

	incomingUrl.searchParams.forEach((value, key) => {
		if (ELECTRIC_PROTOCOL_QUERY_PARAMS.has(key)) {
			originUrl.searchParams.set(key, value);
		}
	});

	const table = incomingUrl.searchParams.get("table");
	if (table) {
		originUrl.searchParams.set("table", table);
	}

	if (process.env.ELECTRIC_SOURCE_ID) {
		originUrl.searchParams.set("source_id", process.env.ELECTRIC_SOURCE_ID);
	}

	if (process.env.ELECTRIC_SOURCE_SECRET) {
		originUrl.searchParams.set("secret", process.env.ELECTRIC_SOURCE_SECRET);
	}

	return originUrl;
}

function normalizeProxyResponse(response: Response) {
	if (!response.headers.get("content-encoding")) {
		return response;
	}

	const headers = new Headers(response.headers);
	headers.delete("content-encoding");
	headers.delete("content-length");

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}

export const electricModule = new Elysia().get("/api/electric", async ({ request, set }) => {
	try {
		const proxyRequest = new Request(buildElectricShapeUrl(request.url).toString(), {
			method: "GET",
			headers: new Headers(),
		});

		const response = normalizeProxyResponse(
			await fetch(proxyRequest, {
				cache: "no-store",
			}),
		);

		return response;
	} catch (error) {
		set.status = 500;
		return {
			error: error instanceof Error ? error.message : "Electric proxy failed",
		};
	}
});