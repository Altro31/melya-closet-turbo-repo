import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { Layer } from "effect";
import { HttpRouter } from "effect/unstable/http";
import { HttpApi, HttpApiBuilder } from "effect/unstable/httpapi";
import { createServer } from "node:http";
import { BaleCategoriesModule } from "./modules/bale-categories.js";
import { BaleModule } from "./modules/bale.js";
import { ClientModule } from "./modules/client.js";
import { ElectricModule } from "./modules/electric.js";
import { OrderModule } from "./modules/order.js";
import { ProductModule } from "./modules/product.js";
import { UserModule } from "./modules/users.js";

export const Api = HttpApi.make("Api")
  .addHttpApi(BaleCategoriesModule.api)
  .addHttpApi(BaleModule.api)
  .addHttpApi(ClientModule.api)
  .addHttpApi(OrderModule.api)
  .addHttpApi(ProductModule.api)
  .addHttpApi(UserModule.api);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const ApiLive = HttpApiBuilder.layer(Api).pipe(
  Layer.provide(BaleCategoriesModule.group),
  Layer.provide(BaleModule.group),
  Layer.provide(ClientModule.group),
  Layer.provide(OrderModule.group),
  Layer.provide(ProductModule.group),
  Layer.provide(UserModule.group),
  Layer.provide(ElectricModule),
  HttpRouter.serve,
  Layer.provide(NodeHttpServer.layer(createServer, { port })),
);

Layer.launch(ApiLive).pipe(NodeRuntime.runMain);
