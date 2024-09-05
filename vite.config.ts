import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            { find: "@components", replacement: path.resolve(__dirname, "./src/components/") },
            { find: "@api", replacement: path.resolve(__dirname, "./src/api/") },
            { find: "@assets", replacement: path.resolve(__dirname, "./src/assets/") },
            { find: "@models", replacement: path.resolve(__dirname, "./src/models/") },
            { find: "@stores", replacement: path.resolve(__dirname, "./src/stores/") },
            { find: "@styles", replacement: path.resolve(__dirname, "./src/assets/styles/") },
            { find: "@pages", replacement: path.resolve(__dirname, "./src/pages/") },
            { find: "@UI", replacement: path.resolve(__dirname, "./src/components/UI/") },
            { find: "@enums", replacement: path.resolve(__dirname, "./src/enums/") },
        ],
    },
    server: {
        port: 3000,
        host: "0.0.0.0",
    },
});
