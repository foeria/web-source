import { defineConfig } from "astro/config";
import react from "@astrojs/react";

function parseSiteUrl(value) {
  if (!value || !value.trim()) {
    return undefined;
  }

  try {
    return new URL(value.trim()).toString();
  } catch {
    return undefined;
  }
}

function getFallbackSiteUrl() {
  if (process.env.GITHUB_ACTIONS !== "true") {
    return "http://localhost:4321/";
  }

  const [owner] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
  if (!owner) {
    return "https://example.com/";
  }

  return `https://${owner}.github.io/`;
}

const providedSite = parseSiteUrl(process.env.SITE_URL);
const site = providedSite ?? getFallbackSiteUrl();
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const [owner, repository] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const isUserPagesRepo = Boolean(owner && repository === `${owner}.github.io`);
const base = providedSite || !isGitHubPages || isUserPagesRepo || !repository ? "/" : `/${repository}/`;

export default defineConfig({
  integrations: [react()],
  output: "static",
  site,
  base,
});
