import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../../apps/api/openapi.json",
  output: {
    clean: true,
    path: "src/generated",
  },
  plugins: ["@hey-api/client-fetch", "@tanstack/react-query"],
});
