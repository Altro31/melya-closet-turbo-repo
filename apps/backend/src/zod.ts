import { schema } from "../../../packages/db/schema/generated/schema";
import { createSchemaFactory } from "@zenstackhq/zod";

export const factory = createSchemaFactory(schema);