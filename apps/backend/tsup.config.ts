import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/main.ts"],
    outDir: "dist",
    clean: true,
    format: ["esm"],
    platform: "node",
    target: "es2022",
    sourcemap: true,
    noExternal: ["@repo/db"],
    define: {
      __BACKEND__: "true",
    },
  },
  {
    entry: ["src/index.ts"],
    outDir: "dist/export/",
    clean: true,
    format: ["esm"],
    platform: "node",
    minifySyntax: true,
    target: "es2022",
    sourcemap: true,
    define: {
      __BACKEND__: "false",
    },
  },
]);
