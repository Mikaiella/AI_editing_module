import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/services/ai-tracking.ts",
        "src/utils/validate-ai-selection.ts",
      ],
      exclude: [
        "node_modules/**",
        "src/tests/**",
        "src/**/*.d.ts",
        "src/types/**",
        "vitest.config.ts",
      ],
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
