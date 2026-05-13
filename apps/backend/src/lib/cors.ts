import { HttpRouter } from "effect/unstable/http";

export const CorsMiddleware = HttpRouter.cors({ allowedOrigins: ["*"] });
