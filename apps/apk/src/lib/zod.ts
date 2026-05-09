import { schema } from "@repo/db/schema.ts";
import { createSchemaFactory } from "@zenstackhq/zod";

export const factory = createSchemaFactory(schema);
