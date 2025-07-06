import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/jira": {
        target: "https://sweetdesignhub.atlassian.net",
        changeOrigin: true,
        rewrite: (path) => {
          console.log(
            "Proxying request:",
            path,
            "to",
            path.replace(/^\/api\/jira/, "/rest/api/3")
          );
          return path.replace(/^\/api\/jira/, "/rest/api/3");
        },
        secure: true,
        logLevel: "debug",
      },
    },
  },
});
