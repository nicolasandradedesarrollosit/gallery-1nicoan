import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Photos: one JSON file each. The image goes in src/content/photos/img and is
 * referenced relatively ("./img/name.jpg"); without one a generated placeholder is
 * drawn in its place.
 */
const photos = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/photos' }),
  schema: ({ image }) =>
    z.object({
      image: image().optional(),
      /** Read by screen readers; never shown on the grid. */
      alt: z.string(),
      title: z.string().optional(),
      location: z.string().optional(),
      /** Newest first. */
      date: z.coerce.date(),
      /** Shape of the placeholder; ignored once there is an image. */
      ratio: z.enum(['3:4', '4:5', '1:1', '3:2', '16:9']).default('4:5'),
      draft: z.boolean().default(false),
    }),
});

export const collections = { photos };
