import { defineConfig } from "vite";
import resumePlugin from "./plugins/vite-resume-plugin.mjs";

export default defineConfig({
  plugins: [resumePlugin({ markdownFile: "index.md" })],
});
