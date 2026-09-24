import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import GithubSlugger from "github-slugger";

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  authorAvatar: string;
  tags: string[];
  draft: boolean;
  readingTime: string;
}

export interface TocEntry {
  depth: 2 | 3;
  text: string;
  slug: string;
}

export interface Post extends PostMeta {
  content: string;
  toc: TocEntry[];
}

function extractToc(content: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];
  const lines = content.split("\n");
  let inCodeFence = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = /^(#{2,3})\s+(.*)$/.exec(line.trim());
    if (!match) continue;

    const depth = match[1].length as 2 | 3;
    const text = match[2].trim();
    entries.push({ depth, text, slug: slugger.slug(text) });
  }

  return entries;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
export const POSTS_PER_PAGE = 12;
export const GRID_POSTS_PER_PAGE = 9;

export function getSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPost(slug: string): Post {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  if (!data.title) {
    throw new Error(`content/posts/${slug}.mdx is missing required frontmatter field "title"`);
  }
  if (!data.date) {
    throw new Error(`content/posts/${slug}.mdx is missing required frontmatter field "date"`);
  }

  return {
    slug,
    title: data.title,
    description: data.description ?? "",
    date: data.date,
    author: data.author ?? "Team Triada",
    authorAvatar: data.authorAvatar ?? "/images/triada_logo.png",
    tags: data.tags ?? [],
    draft: Boolean(data.draft),
    readingTime: readingTime(content).text,
    content,
    toc: extractToc(content),
  };
}

// content/posts is filesystem-backed and only changes on redeploy, so it's
// safe to cache for the lifetime of the process instead of re-reading and
// re-parsing every .mdx file on every call (sitemap, feed, home, tag pages
// all pull this on the same request).
let allPostsCache: PostMeta[] | null = null;

export function getAllPosts(): PostMeta[] {
  if (allPostsCache) return allPostsCache;

  allPostsCache = getSlugs()
    .map((slug) => {
      const { content, toc, ...meta } = getPost(slug);
      void content;
      void toc;
      return meta;
    })
    .filter((p) => process.env.NODE_ENV !== "production" || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return allPostsCache;
}

export function getPostsPage(
  page: number,
  tag?: string,
  perPage: number = POSTS_PER_PAGE
): { posts: PostMeta[]; totalPages: number } {
  const all = tag ? getAllPosts().filter((p) => p.tags.includes(tag)) : getAllPosts();
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return { posts: all.slice(start, start + perPage), totalPages };
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

// getAllPosts() is sorted newest first (index 0 = newest), so a lower index
// is newer and a higher index is older.
export function getAdjacentPosts(slug: string): { newer: PostMeta | null; older: PostMeta | null } {
  const all = getAllPosts();
  const index = all.findIndex((p) => p.slug === slug);
  if (index === -1) return { newer: null, older: null };
  return {
    newer: index > 0 ? all[index - 1] : null,
    older: index < all.length - 1 ? all[index + 1] : null,
  };
}
