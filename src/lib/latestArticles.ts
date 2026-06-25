import { getCollection } from 'astro:content'

export interface ArticleSummary {
  id: string
  hub: string
  title: string
  dek: string
  published: string
  readTime: string
  href: string
}

function estimateReadTime(wordCount: number): string {
  const minutes = Math.max(1, Math.round(wordCount / 200))
  return `${minutes} min read`
}

export async function getLatestArticles(count = 5): Promise<ArticleSummary[]> {
  const all = await getCollection('articles', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  )

  return [...all]
    .sort((a, b) => b.data.published.localeCompare(a.data.published))
    .slice(0, count)
    .map(a => ({
      id: a.id,
      hub: a.data.hub,
      title: a.data.title,
      dek: a.data.dek,
      published: a.data.published,
      readTime: a.data.readTime ?? estimateReadTime(800),
      href: `/${a.data.hub}/${a.id}/`,
    }))
}
