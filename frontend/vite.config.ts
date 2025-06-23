import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import analyzer from "vite-bundle-analyzer";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), analyzer()],
  build: {
    rollupOptions: {
      output: {
        inlineDynamicImports: false,
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
