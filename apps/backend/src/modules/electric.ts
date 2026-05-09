import { Elysia } from "elysia";

const baseUrl = `${process.env.ELECTRIC_URL}/v1/shape`;

export const electricModule = new Elysia().get("/api/electric", async ({ request }) => {

  const url = new URL(request.url);
  const originUrl = new URL(baseUrl);

  // passthrough parameters from electric client
  url.searchParams.forEach((value, key) => {
    originUrl.searchParams.set(key, value);
  });

  const response = await fetch(originUrl);
  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
