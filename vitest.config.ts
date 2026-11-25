import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import path from "node:path";

export default defineConfig(({ mode }) => ({
  // React components in tests use the automatic JSX runtime
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    environment: "node",
    // reads DATABASE_URL from .env for integration tests
    env: loadEnv(mode, process.cwd(), ""),
    fileParallelism: false,
    coverage: {
      provider: "v8",
      include: [
        "src/modules/scoring/**",
        "src/modules/session/rules.ts",
        "src/modules/auth/password.ts",
        "src/modules/auth/token.ts",
        "src/modules/auth/validation.ts",
        "src/modules/billing/access.ts",
        "src/modules/results/results.ts",
        "src/modules/analytics/metrics.ts",
        "src/modules/analytics/csv.ts",
      ],
      reporter: ["text", "html"],
    },
  },
}));
