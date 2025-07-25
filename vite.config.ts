import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    base: "/",
    plugins: [
      react(),
      ...(isDev ? [basicSsl()] : []), // Only add basicSsl in development
    ],
    server: {
      host: true,
    },
  };
});
