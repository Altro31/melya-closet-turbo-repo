import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  clean: true,
  format: ["esm"],
  platform: "node",
  target: "node18",
  sourcemap: true,
  noExternal: ["@repo/db"],
});