import { defineConfig } from "vite";
import resumePlugin from "./plugins/vite-resume-plugin.mjs";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = process.env.GITHUB_ACTIONS === "true" && repoName ? `/${repoName}/` : "/";

export default defineConfig({
  base,
  plugins: [resumePlugin({ markdownFile: "index.md" })],
});
