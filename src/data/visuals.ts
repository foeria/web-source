import { withBase } from "../lib/site";

const decorPool = [
  withBase("/assets/decor/插画1.png"),
  withBase("/assets/decor/插画2.png"),
  withBase("/assets/decor/插画3.png"),
  withBase("/assets/decor/插画4.png"),
  withBase("/assets/decor/插画5.png"),
  withBase("/assets/decor/插画6.png"),
];

const categoryVisualMap: Record<string, string> = {
  "indie-software": withBase("/assets/decor/插画1.png"),
  "dev-resources": withBase("/assets/decor/插画2.png"),
  productivity: withBase("/assets/decor/插画3.png"),
  templates: withBase("/assets/decor/插画4.png"),
  guides: withBase("/assets/decor/插画5.png"),
  others: withBase("/assets/decor/插画6.png"),
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
  return cover ? withBase(cover) : getDecorVisual(slug);
}

export const pageVisuals = {
  resourcesHero: withBase("/assets/decor/插画1.png"),
  announcementsHero: withBase("/assets/decor/插画2.png"),
  notFound: withBase("/assets/decor/插画3.png"),
  emptyState: withBase("/assets/decor/插画4.png"),
  homeAnnouncement: withBase("/assets/decor/插画5.png"),
};
