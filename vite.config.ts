import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { realpathSync } from "fs";

const projectRoot = realpathSync(process.cwd());

export default defineConfig({
    root: projectRoot,
    plugins: [react()],
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    },
    build: {
        target: "esnext",
        outDir: "build",
    },
    server: {
        port: 3000,
        fs: {
            strict: false,
        },
    },
});
