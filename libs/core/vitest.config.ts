import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    extensions: [".web.ts", ".web.tsx", ".ts", ".tsx", ".js"],
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
