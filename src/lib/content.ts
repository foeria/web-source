import { getCollection, type CollectionEntry } from "astro:content";
import { categories } from "../data/categories";

export type ResourceEntry = CollectionEntry<"resources">;
export type AnnouncementEntry = CollectionEntry<"announcements">;

export async function getAllResources() {
  const entries = await getCollection("resources");
  return entries.sort(
    (a, b) => b.data.updatedAt.getTime() - a.data.updatedAt.getTime(),
  );
}

export async function getFeaturedResources() {
  const entries = await getAllResources();
  return entries.filter((entry) => entry.data.featured);
}

export async function getFeaturedSoftware() {
  const entries = await getAllResources();
  return entries.filter((entry) => entry.data.featuredInSoftware);
}

export async function getAllAnnouncements() {
  const entries = await getCollection("announcements");
  return entries.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}

export function getCategoryMeta(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function getTags() {
  const resources = await getAllResources();
  return Array.from(new Set(resources.flatMap((item) => item.data.tags))).sort(
    (a, b) => a.localeCompare(b, "zh-CN"),
  );
}

export function getRelatedResources(
  current: ResourceEntry,
  resources: ResourceEntry[],
  limit = 3,
) {
  return resources
    .filter((resource) => resource.id !== current.id)
    .map((resource) => {
      const sharedTags = resource.data.tags.filter((tag) =>
        current.data.tags.includes(tag),
      ).length;
      const sameCategory =
        resource.data.category === current.data.category ? 2 : 0;
      return { resource, score: sharedTags + sameCategory };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.resource);
}
