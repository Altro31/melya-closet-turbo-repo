import { Elysia } from "elysia";
import { baleCategoriesModule } from "./modules/bale-categories";
import { baleModule } from "./modules/bale";
import { clientModule } from "./modules/client";
import { electricModule } from "./modules/electric";
import { orderModule } from "./modules/order";
import { productModule } from "./modules/product";
import { userModule } from "./modules/users";

const port = Number(process.env.PORT ?? 3000);

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
  .use(userModule)
  .listen(port);

console.log(`Melya backend listening on http://localhost:${port}`);

export type AppType = typeof app;
export default app.compile();
