# TRIADA Research

Blog, whitepapers, and research from [Team Triada](https://triada.in): offensive and
defensive security write-ups, CTF postmortems, and vulnerability research.

Live at **[research.triada.in](https://research.triada.in)**.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack), built as a **static export**,
  no server, no Vercel, hosted on GitHub Pages
- [Tailwind CSS 4](https://tailwindcss.com)
- MDX via [`next-mdx-remote`](https://github.com/hashicorp/next-mdx-remote), no CMS
- [Mermaid](https://mermaid.js.org) for diagrams, live-rendered in the browser
- Content is just files: every post is a `.mdx` file in `content/posts/`, git is the
  database

## Writing a post

See **[CONTRIBUTING.md](./CONTRIBUTING.md)**. Short version:

```bash
cp templates/post-template.mdx content/posts/your-post-slug.mdx
npm run dev
# edit, preview at localhost:3000/your-post-slug, commit, push to main
```

Pushing to `main` is the whole publish step. GitHub Actions builds and deploys
automatically, nothing else to trigger.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to out/, also what CI/deploy runs
npm start        # serve out/ locally to sanity-check the actual export
npm run lint
```

## Project structure

```
app/
  page.tsx                  Home: hero + latest posts
  layout.tsx                Root layout, site-wide metadata, JSON-LD, CSP meta tag
  opengraph-image.tsx        Default OG image (site-wide fallback)
  sitemap.ts / robots.ts     Generated from content/posts at build time
  feed.xml/route.ts          RSS feed
  not-found.tsx              Branded 404, noindex
  research/
    page.tsx                 All-posts page; tag filter + "load more" run client-side
                              in components/research-browser.tsx
  [slug]/
    page.tsx                 Post page (metadata, JSON-LD, TOC, prev/next nav)
    opengraph-image.tsx       Per-post OG image, generated from title/author/date
  tags/
    page.tsx                  All tags, with post counts
    [tag]/page.tsx             Static per-tag page, one per tag at build time

components/
  container.tsx              Shared max-width shell used by nav, footer, every page
  nav.tsx / footer.tsx        Site chrome
  mdx-content.tsx             Maps Markdown elements (h2, code, table, ...) to styled components
  mdx-pre.tsx                 Code block wrapper: copy button, language tag
  mermaid.tsx                 Client-side Mermaid diagram renderer
  toc.tsx                     Sidebar table of contents with scroll-spy
  post-grid.tsx / post-card.tsx   Grid listing, cover image is the post's own OG image
  research-browser.tsx        Client-side tag filter + pagination for /research

lib/
  content.ts                 Reads content/posts/*.mdx, frontmatter validation,
                              tags, prev/next, in-process cache
  seo.ts                      Shared SITE_URL/SITE_NAME/JSON-LD building blocks
  remark-mermaid.ts            Diverts ```mermaid code fences to <Mermaid> before
                                syntax highlighting ever touches them

content/
  posts/*.mdx                 Every published (and draft) post lives here

templates/
  post-template.mdx           Copy this to start a new post (not a real post itself,
                               lives outside content/posts/ so it never renders)

scripts/
  fix-og-extensions.mjs       Postbuild step: Next emits per-post OG images with no
                               file extension under static export, GitHub Pages serves
                               by extension, so this renames them to .png and patches
                               every reference in the build output. Runs automatically
                               as part of `npm run build`.

public/
  fonts/                      Telegraf (headings) + brand fonts
  images/                     Logo, favicon, team photos
  CNAME                       research.triada.in, required by GitHub Pages

.github/workflows/
  ci.yml                      Lint + build check on every PR and push to main
  deploy.yml                   Build + deploy to GitHub Pages on push to main
```

## How content flows

Everything on the site is derived from the `.mdx` files in `content/posts/`. There is
no separate step to register a post, add it to a nav, or generate its social image:

- **Routing:** filename is the URL (`content/posts/foo.mdx` becomes `/foo`)
- **Home, RSS, sitemap:** regenerated from every non-draft post on build
- **Tag pages:** one static page per unique tag across all posts
- **Table of contents:** parsed from each post's `##`/`###` headings
- **OG/Twitter social image:** generated per post via `next/og`, no image to design
- **Diagrams:** a ` ```mermaid ` code block renders as a live diagram, not text

See `lib/content.ts` for the frontmatter schema (`title` and `date` are required, the
build fails without them; everything else has a sane default).

## Design system

Dark theme, brand red accent (`#ff3c3c`), Telegraf for headings, Inter for body,
JetBrains Mono for code and metadata. Matches [triada-react](https://triada.in), the
main Team Triada site. Shared visual tokens live in `app/globals.css`.

## Deployment

Static export (`output: "export"` in `next.config.ts`), hosted on **GitHub Pages**,
not Vercel. That rules out a few Next.js features, and the tradeoffs are worth
knowing:

- **No server-side headers.** The old CSP/HSTS/X-Frame-Options set via
  `next.config.ts`'s `headers()` don't work under static export. CSP survives as a
  `<meta http-equiv>` tag in `app/layout.tsx`; HSTS, X-Frame-Options, and
  Permissions-Policy have no static equivalent and GitHub Pages doesn't support
  custom HTTP headers at all, so those are simply not enforced on this host.
- **No ISR, no dynamic routes.** Every route is either static (`generateStaticParams`)
  or fully client-rendered (the `/research` tag filter). `sitemap.ts`, `robots.ts`,
  `opengraph-image.tsx`, and `feed.xml/route.ts` all carry `export const dynamic =
  "force-static"`, required for `output: "export"`.
- **`next/image` runs unoptimized** (`images.unoptimized: true`), there's no server to
  run the optimizer.

Deploy flow: push to `main` → `.github/workflows/deploy.yml` runs `npm run build`
(which also runs `scripts/fix-og-extensions.mjs`) → uploads `out/` as a Pages
artifact → GitHub Pages serves it at `research.triada.in` via the `public/CNAME` file.
No manual deploy step, no external platform account needed.
