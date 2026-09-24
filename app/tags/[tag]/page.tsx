import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllTags, getPostsByTag } from "@/lib/content";
import { PostGrid } from "@/components/post-grid";
import { Container } from "@/components/container";
import { SITE_URL, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/tags/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  const description = `${posts.length} post${posts.length === 1 ? "" : "s"} tagged "${tag}" on TRIADA Research.`;
  const url = `${SITE_URL}/tags/${tag}`;
  return {
    title: `#${tag}`,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: `#${tag} | TRIADA Research`, description },
  };
}

export default async function TagPage({ params }: PageProps<"/tags/[tag]">) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  const breadcrumbs = breadcrumbSchema([
    { name: "Research", url: `${SITE_URL}/` },
    { name: "Tags", url: `${SITE_URL}/tags` },
    { name: tag, url: `${SITE_URL}/tags/${tag}` },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/tags/${tag}#collection`,
    name: `Research tagged "${tag}"`,
    url: `${SITE_URL}/tags/${tag}`,
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
      <span className="section-label">Tag</span>
      <h1 className="heading-section">{tag}</h1>
      <p className="mt-4 text-[15px]" style={{ color: "#a8adb5" }}>
        {posts.length} post{posts.length === 1 ? "" : "s"}
      </p>

      <PostGrid posts={posts} className="mt-12" />
    </Container>
  );
}
