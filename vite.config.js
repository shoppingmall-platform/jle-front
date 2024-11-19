import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import jsconfigPaths from "vite-jsconfig-paths";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  alias: [
    {
      find: "@/",
      replacement: path.resolve(__dirname, "src"),
    },
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
});
