import { defineConfig } from "astro/config";
import react from "@astrojs/react";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const base = isGitHubPages && repository ? `/${repository}/` : "/";

export default defineConfig({
  integrations: [react()],
  output: "static",
  site: process.env.SITE_URL ?? "https://example.com",
  base,
});
