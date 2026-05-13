import { Effect, Exit, Option, Schema, Stream } from "effect";
import { FetchHttpClient, HttpClient, HttpServerResponse } from "effect/unstable/http";
import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSchema,
} from "effect/unstable/httpapi";

const baseUrl = `${process.env.ELECTRIC_URL}/v1/shape`;

export class ElectricModule {
  static api = HttpApi.make("Api").add(
    HttpApiGroup.make("electric", { topLevel: true }).add(
      HttpApiEndpoint.get("electric", "/electric", {
        success: Schema.Any.pipe(
          HttpApiSchema.asText({
            contentType: "application/octet-stream",
          }),
        ),
      }),
    ),
  );

  static group = HttpApiBuilder.group(this.api, "electric", (handlers) =>
    handlers.handle(
      "electric",
      Effect.fn("Electric")(function* ({ request }) {
        const client = yield* HttpClient.HttpClient;
        const url = new URL(request.url, "http://localhost");
        const originUrl = new URL(baseUrl);

        url.searchParams.forEach((value, key) => {
          originUrl.searchParams.set(key, value);
        });

        const responseExit = yield* client.get(originUrl).pipe(Effect.exit);
        if (Exit.isFailure(responseExit)) {
          return responseExit.cause.reasons[0];
        }

        const response = responseExit.value;
        const headers = response.headers;

        return HttpServerResponse.stream(response.stream, {
          status: response.status,
          headers: {
            ...headers,
            ["content-encoding"]: undefined,
            ["content-length"]: undefined,
          },
        });
      }, Effect.provide(FetchHttpClient.layer)),
    ),
  );
}
