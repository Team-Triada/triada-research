# Writing for TRIADA Research

This is the source for [research.triada.in](https://research.triada.in). Every post is a
single `.mdx` file in `content/posts/`. No CMS, no dashboard: write the file, commit it,
open a PR.

## Quick start

1. Copy the template:

   ```bash
   cp templates/post-template.mdx content/posts/your-post-slug.mdx
   ```

   The filename becomes the URL. `content/posts/ssrf-in-my-app.mdx` becomes
   `research.triada.in/ssrf-in-my-app`. Use lowercase, hyphens, no spaces or dates in
   the filename.

2. Fill in the frontmatter (the `---` block at the top) and write the post below it.

3. Run it locally and check the rendered page before opening a PR:

   ```bash
   npm install
   npm run dev
   ```

   Open `http://localhost:3000/your-post-slug`.

4. Commit and push a branch, open a PR. Someone reviews, flips `draft: false`, merges.

## Frontmatter fields

```yaml
---
title: "Your Title Here: Specific and Searchable"
description: "One or two sentences. Shows in the post list, RSS, and search results."
date: "2026-01-15"
author: "Team Triada"
authorAvatar: "/images/triada_logo.png"
tags: ["research", "web"]
draft: true
---
```

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Build fails if missing. Becomes the `<h1>`, the page `<title>`, and the OG image text. |
| `date` | yes | Build fails if missing. Format `YYYY-MM-DD`. Controls sort order everywhere (home, tags, RSS, sitemap). |
| `description` | no, but write one | Falls back to empty string. Used for the meta description, OG/Twitter cards, and the post-list preview text. Keep it under ~160 characters. |
| `author` | no | Defaults to `"Team Triada"`. Set your own name if you want individual credit. |
| `authorAvatar` | no | Defaults to the Triada mark. To use a real photo, point it at an existing file under `public/images/team/` (check what's there) or add your own to that folder. |
| `tags` | no | Defaults to `[]`. First tag becomes the eyebrow label on the post page and the post's og:image. All tags are clickable and generate `/tags/<tag>` pages automatically, no extra step needed. Reuse existing tags where they fit, run `ls content/posts` and skim a couple files, or check `research.triada.in/tags` for the current list, so the archive doesn't fragment into one-off tags. |
| `draft` | no | Defaults to `false`. Set `true` while writing. Draft posts are excluded from the site, sitemap, and RSS feed in production, but still render if you hit the URL directly in `npm run dev`. |

## Writing rules

- **No em dashes.** Use a period, comma, colon, or parentheses instead. This is
  enforced by eye in review, not by a linter, so check yourself before opening a PR.
- **Sound human.** Write like you're explaining it to another engineer, not like you're
  padding a report. Short sentences over long ones. Cut hedging ("it's worth noting
  that...", "one might argue...").
- **No client names, no live unpatched vulnerabilities.** If a post comes out of a real
  engagement, generalize it: describe the technique and the class of bug, not the
  target. If it's a disclosure, don't publish exploit details before the vendor has
  fixed it.
- **Open with the point.** First two lines should tell the reader what this post is
  about and why it matters. No throat-clearing intro paragraph.

## Formatting

- **Headings:** `##` (H2) for major sections, `###` (H3) for subsections. The sidebar
  table of contents only tracks H2 and H3, don't skip straight to H3 without an H2
  above it, and don't go deeper than H3.
- **Code blocks:** always tag the language for syntax highlighting (` ```bash `,
  ` ```python `, etc). Use ` ```text ` if there's genuinely no language. Every code
  block gets a copy button automatically, you don't add that yourself.
- **Inline code:** single backticks for file names, commands, variables, endpoints.
- **Bold:** `**text**` renders in the brand accent color. Use it for the one or two
  things per section you actually want to stand out, not everything that sounds
  important.
- **Images:** put files under `public/images/posts/<your-slug>/`, reference with
  standard Markdown `![alt text](/images/posts/your-slug/file.png)`. Alt text is not
  optional, describe what's actually in the image.
- **Links:** standard Markdown `[text](url)`.

## What happens automatically

You don't need to touch any of this, it's all derived from the `.mdx` file:

- **Routing:** the filename becomes the URL, no route file to create.
- **Home page listing, pagination, RSS feed, sitemap.xml:** regenerated from every
  non-draft post on build.
- **Table of contents:** built from your H2/H3 headings.
- **Tag pages:** one per unique tag across all posts, created and removed as tags
  change.
- **OG/Twitter social card image:** generated per post from the title, tag, author,
  and date. Nothing to design or upload.
- **Reading time, prev/next post navigation:** computed from content and post order.

## Local preview checklist before opening a PR

- [ ] `npm run dev`, open the post, read it top to bottom rendered (not just the raw
      `.mdx`)
- [ ] Table of contents in the sidebar matches your actual headings
- [ ] Code blocks have the right language tag and the copy button works
- [ ] No em dashes anywhere (search the file for the character and rewrite around it)
- [ ] `draft: true` until it's actually ready, flip to `false` in the PR that publishes it
- [ ] `npm run build` passes locally (catches missing `title`/`date` and any MDX syntax
      errors before CI does)
