const decorPool = [
  "/assets/decor/插画1.png",
  "/assets/decor/插画2.png",
  "/assets/decor/插画3.png",
  "/assets/decor/插画4.png",
  "/assets/decor/插画5.png",
  "/assets/decor/插画6.png",
];

const categoryVisualMap: Record<string, string> = {
  "indie-software": "/assets/decor/插画1.png",
  "dev-resources": "/assets/decor/插画2.png",
  productivity: "/assets/decor/插画3.png",
  templates: "/assets/decor/插画4.png",
  guides: "/assets/decor/插画5.png",
  others: "/assets/decor/插画6.png",
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
  resourcesHero: "/assets/decor/插画1.png",
  announcementsHero: "/assets/decor/插画2.png",
  notFound: "/assets/decor/插画3.png",
  emptyState: "/assets/decor/插画4.png",
  homeAnnouncement: "/assets/decor/插画5.png",
};
