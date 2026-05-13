import { DatabaseClientBase } from "@/common/db/base";
import { DatabaseClientMock } from "@/common/db/mock";

declare const __BACKEND__: boolean;

export const DatabaseClient = __BACKEND__ ? DatabaseClientBase : DatabaseClientMock;
