import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs", "iife"],
  clean: true,
  globalName: "venn2",
  dts: true,
  bundle: true,
})
