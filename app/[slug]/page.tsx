import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAdjacentPosts, getPost, getSlugs } from "@/lib/content";
import { MdxContent } from "@/components/mdx-content";
import { Toc } from "@/components/toc";
import { Container } from "@/components/container";
import { SITE_URL, organizationSchema, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  const url = `${SITE_URL}/${slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;

  const post = getPost(slug);
  if (post.draft && process.env.NODE_ENV === "production") notFound();

  const { newer, older } = getAdjacentPosts(slug);
  const url = `${SITE_URL}/${slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: organizationSchema,
    image: `${url}/opengraph-image`,
    keywords: post.tags.join(", "),
    isPartOf: { "@id": `${SITE_URL}/#blog` },
  };

  const breadcrumbs = breadcrumbSchema([
    { name: "Research", url: `${SITE_URL}/` },
    { name: post.title, url },
  ]);

  return (
    <Container style={{ paddingTop: 64, paddingBottom: 80 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <article className="min-w-0" style={{ maxWidth: 900 }}>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2" style={{ marginBottom: 20, fontSize: 12.5 }}>
            <Link href="/" style={{ color: "#5a6270", textDecoration: "none" }}>
              Research
            </Link>
            {post.tags[0] && (
              <>
                <span style={{ color: "var(--border-strong)" }}>/</span>
                <Link href={`/tags/${post.tags[0]}`} style={{ color: "#5a6270", textDecoration: "none" }}>
                  {post.tags[0]}
                </Link>
              </>
            )}
          </nav>
          <div className="mb-12" style={{ borderBottom: "1px solid var(--border)", paddingBottom: 32 }}>
            <h1 className="heading-section" style={{ fontSize: "clamp(28px, 4vw, 38px)", lineHeight: 1.2 }}>
              {post.title}
            </h1>

            <div className="mt-6 flex items-center gap-3">
              <Image
                src={post.authorAvatar}
                alt={post.author}
                width={40}
                height={40}
                className="rounded-full object-cover"
                style={{ width: 40, height: 40, border: "1px solid var(--border-strong)" }}
              />
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#e8eaed" }}>{post.author}</div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs" style={{ color: "#5a6270" }}>
                  <span>{post.date}</span>
                  <span style={{ color: "var(--border-strong)" }}>·</span>
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </div>

            {post.tags.length > 0 && (
              <div className="tag-scroll-wrap mt-5">
                <div className="tag-scroll">
                  {post.tags.map((tag) => (
                    <Link key={tag} href={`/tags/${tag}`} className="pill-tag" style={{ textDecoration: "none" }}>
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <MdxContent source={post.content} />

          {(newer || older) && (
            <div className="mt-16 grid gap-2 sm:grid-cols-2" style={{ borderTop: "1px solid var(--border)", paddingTop: 24 }}>
              {newer ? (
                <Link
                  href={`/${newer.slug}`}
                  className="card-surface flex flex-col justify-center"
                  style={{ textDecoration: "none", padding: "10px 14px" }}
                >
                  <span
                    className="font-mono"
                    style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5a6270" }}
                  >
                    ← Newer
                  </span>
                  <span
                    className="truncate"
                    style={{ color: "#e8eaed", fontSize: 13.5, marginTop: 2 }}
                  >
                    {newer.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {older ? (
                <Link
                  href={`/${older.slug}`}
                  className="card-surface flex flex-col justify-center sm:items-end sm:text-right"
                  style={{ textDecoration: "none", padding: "10px 14px" }}
                >
                  <span
                    className="font-mono"
                    style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5a6270" }}
                  >
                    Older →
                  </span>
                  <span
                    className="truncate"
                    style={{ color: "#e8eaed", fontSize: 13.5, marginTop: 2, maxWidth: "100%" }}
                  >
                    {older.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </div>
          )}
        </article>

        <aside className="hidden lg:block">
          <Toc entries={post.toc} />
        </aside>
      </div>
    </Container>
  );
}
