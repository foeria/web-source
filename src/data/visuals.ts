const decorPool = [
  "/assets/decor/hero-anime-girl.png",
  "/assets/decor/forest-anime-portrait.png",
  "/assets/decor/gaming-anime-girl.png",
  "/assets/decor/falling-anime-girl.png",
];

const categoryVisualMap: Record<string, string> = {
  "indie-software": "/assets/decor/hero-anime-girl.png",
  "dev-resources": "/assets/decor/gaming-anime-girl.png",
  productivity: "/assets/decor/forest-anime-portrait.png",
  templates: "/assets/decor/falling-anime-girl.png",
  guides: "/assets/decor/forest-anime-portrait.png",
  others: "/assets/decor/gaming-anime-girl.png",
};

function hashValue(input: string) {
  return Array.from(input).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function getDecorVisual(seed: number | string = 0) {
  const index =
    typeof seed === "number"
      ? seed
      : hashValue(seed);
  return decorPool[Math.abs(index) % decorPool.length];
}

export function getCategoryVisual(slug: string) {
  return categoryVisualMap[slug] ?? getDecorVisual(slug);
}

export function getTagVisual(tag: string) {
  return getDecorVisual(tag);
}

export function getAnnouncementVisual(seed: number | string = 0) {
  return getDecorVisual(seed);
}

export function getResourceVisual(slug: string, cover?: string) {
  return cover ?? getDecorVisual(slug);
}

export const pageVisuals = {
  resourcesHero: "/assets/decor/hero-anime-girl.png",
  announcementsHero: "/assets/decor/falling-anime-girl.png",
  notFound: "/assets/decor/forest-anime-portrait.png",
  emptyState: "/assets/decor/gaming-anime-girl.png",
  homeAnnouncement: "/assets/decor/falling-anime-girl.png",
};
