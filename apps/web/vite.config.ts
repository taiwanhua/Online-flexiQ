import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": "/src",
//     },
//   },
// });

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // https://dev.to/boostup/uncaught-referenceerror-process-is-not-defined-12kg
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env": env,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  };
});
