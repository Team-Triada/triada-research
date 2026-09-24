# TRIADA Research

Blog, whitepapers, and research from [Team Triada](https://triada.in): offensive and
defensive security write-ups, CTF postmortems, and vulnerability research.

Live at **[research.triada.in](https://research.triada.in)**.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [Tailwind CSS 4](https://tailwindcss.com)
- MDX via [`next-mdx-remote`](https://github.com/hashicorp/next-mdx-remote), no CMS
- Content is just files: every post is a `.mdx` file in `content/posts/`, git is the
  database

## Writing a post

See **[CONTRIBUTING.md](./CONTRIBUTING.md)**. Short version:

```bash
cp templates/post-template.mdx content/posts/your-post-slug.mdx
npm run dev
# edit, preview at localhost:3000/your-post-slug, commit, open a PR
```

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build, also what CI/deploy runs
npm run lint
```

## Project structure

```
app/
  page.tsx                  Home: paginated post list
  layout.tsx                Root layout, site-wide metadata, JSON-LD
  opengraph-image.tsx        Default OG image (site-wide fallback)
  sitemap.ts / robots.ts     Generated from content/posts at build time
  feed.xml/route.ts          RSS feed
  [slug]/
    page.tsx                 Post page (metadata, JSON-LD, TOC, prev/next nav)
    opengraph-image.tsx       Per-post OG image, generated from title/author/date
  tags/
    page.tsx                  All tags, with post counts
    [tag]/page.tsx             Posts filtered by one tag

components/
  container.tsx              Shared max-width shell used by nav, footer, every page
  nav.tsx / footer.tsx        Site chrome
  mdx-content.tsx             Maps Markdown elements (h2, code, table, ...) to styled components
  mdx-pre.tsx                 Code block wrapper: copy button, language tag
  toc.tsx                     Sidebar table of contents with scroll-spy
  post-list.tsx / pagination.tsx   Shared by home and tag pages

lib/
  content.ts                 Reads content/posts/*.mdx, frontmatter validation,
                              tags, pagination, prev/next, in-process cache

content/
  posts/*.mdx                 Every published (and draft) post lives here

templates/
  post-template.mdx           Copy this to start a new post (not a real post itself,
                               lives outside content/posts/ so it never renders)

public/
  fonts/                      Telegraf (headings) + brand fonts
  images/                     Logo, favicon, team photos
```

## How content flows

Everything on the site is derived from the `.mdx` files in `content/posts/`. There is
no separate step to register a post, add it to a nav, or generate its social image:

- **Routing:** filename is the URL (`content/posts/foo.mdx` becomes `/foo`)
- **Home, RSS, sitemap:** regenerated from every non-draft post on build
- **Tag pages:** one per unique tag across all posts
- **Table of contents:** parsed from each post's `##`/`###` headings
- **OG/Twitter social image:** generated per post via `next/og`, no image to design

See `lib/content.ts` for the frontmatter schema (`title` and `date` are required, the
build fails without them; everything else has a sane default).

## Design system

Dark theme, brand red accent (`#ff3c3c`), Telegraf for headings, Inter for body,
JetBrains Mono for code and metadata. Matches [triada-react](https://triada.in), the
main Team Triada site. Shared visual tokens live in `app/globals.css`.

## Deployment

Standard Next.js app, not a static export (uses `headers()` for CSP/security headers
in `next.config.ts`, which static export doesn't support). Deploy to Vercel, point
`research.triada.in` at it.
