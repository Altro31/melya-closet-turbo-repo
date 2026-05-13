import { BaleModule } from "@/modules/bale";
import { BaleCategoriesModule } from "@/modules/bale-categories";
import { ClientModule } from "@/modules/client";
import { ElectricModule } from "@/modules/electric";
import { OrderModule } from "@/modules/order";
import { ProductModule } from "@/modules/product";
import { UserModule } from "@/modules/users";
import { Schema } from "effect";
import { HttpApi, HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/unstable/httpapi";

export type Api = typeof Api;
export const Api = HttpApi.make("Api")
  .add(
    HttpApiGroup.make("ROOT").add(
      HttpApiEndpoint.get("hello", "/", { success: Schema.String.pipe(HttpApiSchema.asText()) }),
    ),
  )
  .addHttpApi(BaleCategoriesModule.api)
  .addHttpApi(BaleModule.api)
  .addHttpApi(ClientModule.api)
  .addHttpApi(OrderModule.api)
  .addHttpApi(ProductModule.api)
  .addHttpApi(UserModule.api)
  .addHttpApi(ElectricModule.api);
