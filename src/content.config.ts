import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const commonContentFields = {
  title: z.string().min(3),
  description: z.string().min(20),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  tags: z.array(z.string().min(2)).default([]),
  category: z.string().min(2),
  canonical: z.url().optional(),
  image: z.string().optional(),
};

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    ...commonContentFields,
    type: z.literal('note').default('note'),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    ...commonContentFields,
    type: z.literal('project').default('project'),
    status: z
      .enum(['concept', 'active', 'maintained', 'archived'])
      .default('concept'),
    featured: z.boolean().default(false),
    technologies: z.array(z.string().min(1)).default([]),
  }),
});

const labs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/labs' }),
  schema: z.object({
    ...commonContentFields,
    type: z.literal('lab').default('lab'),
    status: z.enum(['idea', 'prototype', 'active', 'archived']).default('idea'),
    relatedProjects: z.array(z.string()).default([]),
  }),
});

export const collections = { notes, projects, labs };
