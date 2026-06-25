import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articles' }),
  schema: z.object({
    title:       z.string(),
    hub:         z.enum(['2a','2b','2c','3a','3b','3c','4a','4b','4c',
                         'hair-care','products','parents']),
    category:    z.string(),
    dek:         z.string(),
    published:   z.string(),
    updated:     z.string().optional(),
    readTime:    z.string().optional(),
    featured:    z.boolean().default(false),
    tested:      z.boolean().default(false),
    // ArticleHero fields — optional; when present, hero layout is used
    heroImage:      z.string().optional(),
    heroImageAlt:   z.string().optional(),
    heroImageCredit:z.string().optional(),
    standfirst:     z.string().optional(),
    shortAnswer:    z.string().optional(),
    products:    z.array(z.object({
      name:      z.string(),
      brand:     z.string(),
      verdict:   z.enum(['buy','skip','not-yet-tested']),
      price:     z.string().optional(),
      buyUrl:    z.string().url().optional(),
      claims:    z.array(z.string()).max(3).optional(),
    })).optional(),
    // CMS fields — additive, all optional with safe defaults
    draft:            z.boolean().default(false),
    confidence_grade: z.enum(['high','medium','low']).optional(),
    contributor_id:   z.string().optional(),
  }),
})

const hubs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/hubs' }),
  schema: z.object({
    title:       z.string(),
    hub:         z.enum(['2a','2b','2c','3a','3b','3c','4a','4b','4c',
                         'hair-care','products','parents']),
    dek:         z.string(),
  }),
})

export const collections = { articles, hubs }
