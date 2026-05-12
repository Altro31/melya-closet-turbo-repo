import { Effect } from "effect";
import { HttpRouter, HttpServerResponse } from "effect/unstable/http";

const baseUrl = `${process.env.ELECTRIC_URL}/v1/shape`;

export const ElectricModule = HttpRouter.add("GET", "/api/electric", (request) =>
  Effect.gen(function* () {
    const url = new URL(request.url, "http://localhost");
    const originUrl = new URL(baseUrl);

    url.searchParams.forEach((value, key) => {
      originUrl.searchParams.set(key, value);
    });

    const response = yield* Effect.promise(() => fetch(originUrl));
    const headers = Object.fromEntries(response.headers.entries());
    
    delete headers["content-encoding"];
    delete headers["content-length"];

    const body = yield* Effect.promise(() => response.arrayBuffer());

    return HttpServerResponse.uint8Array(new Uint8Array(body), {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }),
);
