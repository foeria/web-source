import { defineCollection, z } from "astro:content";

const resources = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    type: z.string(),
    subType: z.string().optional(),
    platform: z.array(z.string()),
    version: z.string(),
    fileFormat: z.string(),
    fileSize: z.string(),
    cover: z.string(),
    gallery: z.array(z.string()).default([]),
    downloadProvider: z.string().default("baidu-pan"),
    baiduPanUrl: z.string().url(),
    backupUrls: z.array(z.string().url()).default([]),
    extractCode: z.string(),
    downloadNote: z.string(),
    featured: z.boolean().default(false),
    featuredInSoftware: z.boolean().default(false),
    status: z.enum(["active", "archived", "display-only"]).default("active"),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    aliases: z.array(z.string()).default([]),
    keywords: z.array(z.string()).default([]),
    overview: z.string().optional(),
    tutorial: z.string().optional(),
    changelog: z.string().optional(),
    notes: z.string().optional(),
    usageSteps: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          image: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

const announcements = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    pinned: z.boolean().default(false),
    publishedAt: z.coerce.date(),
  }),
});

export const collections = {
  resources,
  announcements,
};
