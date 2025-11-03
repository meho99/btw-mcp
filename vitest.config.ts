import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.test.ts", "src/**/*.spec.ts", "**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      include: ["src/**/*"],
      exclude: ["src/**/*.spec.ts", "src/**/*.test.ts"],
    },
    typecheck: {
      tsconfig: "./tsconfig.json",
    },
  },
});
