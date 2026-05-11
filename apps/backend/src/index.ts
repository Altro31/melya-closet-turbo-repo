import { Elysia } from "elysia";
import { baleCategoriesModule } from "./modules/bale-categories";
import { baleModule } from "./modules/bale";
import { clientModule } from "./modules/client";
import { electricModule } from "./modules/electric";
import { orderModule } from "./modules/order";
import { productModule } from "./modules/product";
import { userModule } from "./modules/users";

const portValue = process.env.PORT;
const defaultPort = process.env.RENDER === "true" ? "10000" : "3000";
const port = Number.parseInt(portValue ?? defaultPort, 10);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error(`Invalid PORT value: ${portValue ?? "undefined"}`);
}

const hostname = process.env.HOST?.trim() || "0.0.0.0";

const app = new Elysia()
  .onRequest(({ request, set }) => {
    const origin = request.headers.get("origin");

    set.headers["access-control-allow-origin"] = origin ?? "*";
    set.headers["access-control-allow-methods"] = "GET,POST,PATCH,DELETE,OPTIONS";
    set.headers["access-control-allow-headers"] = "Content-Type";
    set.headers.vary = "Origin";
  })
  .options("/api/*", ({ set }) => {
    set.status = 204;
    return "";
  })
  .get("/", () => ({ status: "ok" }))
  .use(baleCategoriesModule)
  .use(baleModule)
  .use(clientModule)
  .use(electricModule)
  .use(orderModule)
  .use(productModule)
  .use(userModule);

app.listen({ hostname, port });

console.log(`Melya backend listening on http://${hostname}:${port}`);

export type AppType = typeof app;
export default app
