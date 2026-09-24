import type { Metadata } from "next";
import { getAllTags, getAllPosts } from "@/lib/content";
import { Container } from "@/components/container";
import { ResearchBrowser } from "@/components/research-browser";
import { SITE_URL, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "All Research",
  description: "Every blog post, whitepaper, and research note from Team Triada, browsable by tag.",
  alternates: { canonical: `${SITE_URL}/research` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/research`,
    title: "All Research | TRIADA Research",
    description: "Every blog post, whitepaper, and research note from Team Triada, browsable by tag.",
  },
};

export default function ResearchPage() {
  const tags = getAllTags();
  const posts = getAllPosts();

  const breadcrumbs = breadcrumbSchema([
    { name: "Research", url: `${SITE_URL}/` },
    { name: "All Research", url: `${SITE_URL}/research` },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/research#collection`,
    name: "All Research",
    url: `${SITE_URL}/research`,
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

      <ResearchBrowser posts={posts} tags={tags} />
    </Container>
  );
}
