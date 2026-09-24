import Link from "next/link";
import type { Metadata } from "next";
import { getAllTags, getPostsPage, GRID_POSTS_PER_PAGE } from "@/lib/content";
import { PostGrid } from "@/components/post-grid";
import { Pagination } from "@/components/pagination";
import { Container } from "@/components/container";
import { SITE_URL, breadcrumbSchema } from "@/lib/seo";

export async function generateMetadata({ searchParams }: PageProps<"/research">): Promise<Metadata> {
  const params = await searchParams;
  const tag = typeof params.tag === "string" ? params.tag : undefined;
  const page = Number(params.page ?? 1) || 1;

  if (tag) {
    // the per-tag page at /tags/[tag] is the canonical URL for this content,
    // this page is just a nicer way to browse the same posts with a live filter
    return {
      title: `#${tag}`,
      description: `Research tagged "${tag}" from Team Triada.`,
      alternates: { canonical: `${SITE_URL}/tags/${tag}` },
    };
  }

  const canonical = page > 1 ? `${SITE_URL}/research?page=${page}` : `${SITE_URL}/research`;
  return {
    title: "All Research",
    description: "Every blog post, whitepaper, and research note from Team Triada, browsable by tag.",
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: "All Research | TRIADA Research",
      description: "Every blog post, whitepaper, and research note from Team Triada, browsable by tag.",
    },
  };
}

export default async function ResearchPage({ searchParams }: PageProps<"/research">) {
  const params = await searchParams;
  const tag = typeof params.tag === "string" ? params.tag : undefined;
  const page = Number(params.page ?? 1) || 1;

  const tags = getAllTags();
  const { posts, totalPages } = getPostsPage(page, tag, GRID_POSTS_PER_PAGE);

  const breadcrumbs = breadcrumbSchema([
    { name: "Research", url: `${SITE_URL}/` },
    { name: "All Research", url: `${SITE_URL}/research` },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/research#collection`,
    name: tag ? `Research tagged "${tag}"` : "All Research",
    url: tag ? `${SITE_URL}/research?tag=${tag}` : `${SITE_URL}/research`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <Container style={{ paddingTop: 80, paddingBottom: 80 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <span className="section-label">Team Triada</span>
      <h1 className="heading-section">All Research</h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: "#a8adb5" }}>
        Every blog post, whitepaper, and research note, in one place.
      </p>

      <div className="tag-scroll-wrap mt-8">
        <div className="tag-scroll">
          <Link
            href="/research"
            className="pill-tag"
            style={{
              textDecoration: "none",
              borderColor: tag ? undefined : "var(--triada-cyan)",
              color: tag ? undefined : "#ffffff",
            }}
          >
            All
          </Link>
          {tags.map(({ tag: t, count }) => (
            <Link
              key={t}
              href={`/research?tag=${t}`}
              className="pill-tag"
              style={{
                textDecoration: "none",
                gap: 6,
                borderColor: tag === t ? "var(--triada-cyan)" : undefined,
                color: tag === t ? "#ffffff" : undefined,
              }}
            >
              {t}
              <span style={{ color: "#5a6270" }}>{count}</span>
            </Link>
          ))}
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="mt-16 text-sm" style={{ color: "#5a6270" }}>
          No posts tagged &ldquo;{tag}&rdquo; yet.
        </p>
      ) : (
        <>
          <PostGrid posts={posts} className="mt-12" />
          <Pagination currentPage={page} totalPages={totalPages} basePath="/research" query={{ tag }} />
        </>
      )}
    </Container>
  );
}
