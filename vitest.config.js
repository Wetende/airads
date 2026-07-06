import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const fromRoot = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./frontend/src/test/setup.js"],
        include: ["frontend/src/**/*.test.{js,jsx}"],
        alias: {
            "react-transition-group/TransitionGroupContext": fromRoot(
                "./node_modules/react-transition-group/esm/TransitionGroupContext.js",
            ),
        },
        server: {
            deps: {
                inline: ["@mui/material"],
            },
        },
        coverage: {
            reporter: ["text", "json", "html"],
            include: ["frontend/src/**/*.{js,jsx}"],
            exclude: ["frontend/src/test/**"],
        },
    },
    resolve: {
        alias: {
            "@": fromRoot("./frontend/src"),
        },
    },
});
