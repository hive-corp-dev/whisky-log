import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const Categories = ["review", "ranking", "column"] as const;

const Tags = [
  "japanese",
  "irish",
  "scotch",
  "canadian",
  "indian",
  "taiwanese",
  "blended",
  "single-molt",
  "blended-molt",
  "grain",
  "single-grain",
] as const;

const blog = defineCollection({
  loader: glob({ pattern: "**\/[^_]*.mdx", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      draft: z.boolean(),
      title: z.string(),
      description: z.string(),
      image: image(),
      category: z.enum(Categories),
      tags: z.array(z.enum(Tags)),
      country: z.enum(["japan", "scotland", "ireland", "us", "uk", "canada", "india", "taiwan"]).optional(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
    }),
});

export const collections = { blog };
