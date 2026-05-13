import { BaleModule } from "@/modules/bale";
import { BaleCategoriesModule } from "@/modules/bale-categories";
import { ClientModule } from "@/modules/client";
import { ElectricModule } from "@/modules/electric";
import { OrderModule } from "@/modules/order";
import { ProductModule } from "@/modules/product";
import { UserModule } from "@/modules/users";
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { Effect, Layer } from "effect";
import { HttpRouter } from "effect/unstable/http";
import { HttpApiBuilder, HttpApiScalar } from "effect/unstable/httpapi";
import { createServer } from "http";
import { Api } from "./index";
import { CorsMiddleware } from "@/lib/cors";

const RootGroup = HttpApiBuilder.group(Api, "ROOT", (handler) =>
  handler.handle("hello", () => Effect.succeed("Hello")),
);


const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const ApiLive = HttpApiBuilder.layer(Api).pipe(
  Layer.provide(RootGroup),
  Layer.provide(BaleCategoriesModule.group),
  Layer.provide(BaleModule.group),
  Layer.provide(ClientModule.group),
  Layer.provide(OrderModule.group),
  Layer.provide(ProductModule.group),
  Layer.provide(UserModule.group),
  Layer.provide(ElectricModule.group),
  Layer.provide(CorsMiddleware),
  Layer.provide(HttpApiScalar.layer(Api)),
  HttpRouter.serve,
  Layer.provide(NodeHttpServer.layer(createServer, { port })),
);

Layer.launch(ApiLive).pipe(NodeRuntime.runMain);
