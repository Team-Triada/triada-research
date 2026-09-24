import Link from "next/link";
import type { Metadata } from "next";
import { getAllTags } from "@/lib/content";
import { Container } from "@/components/container";
import { SITE_URL, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse TRIADA Research posts by topic: SSRF, secrets management, CTF writeups, and more.",
  alternates: { canonical: `${SITE_URL}/tags` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/tags`,
    title: "Tags | TRIADA Research",
    description: "Browse TRIADA Research posts by topic: SSRF, secrets management, CTF writeups, and more.",
  },
};

export default function TagsPage() {
  const tags = getAllTags();

  const breadcrumbs = breadcrumbSchema([
    { name: "Research", url: `${SITE_URL}/` },
    { name: "Tags", url: `${SITE_URL}/tags` },
  ]);

  return (
    <Container style={{ paddingTop: 80, paddingBottom: 80 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <span className="section-label">Team Triada</span>
      <h1 className="heading-section">Tags</h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: "#a8adb5" }}>
        Browse research by topic.
      </p>

      {tags.length === 0 ? (
        <p className="mt-16 text-sm" style={{ color: "#5a6270" }}>
          No tags yet.
        </p>
      ) : (
        <div className="mt-12 flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="pill-tag"
              style={{ textDecoration: "none", display: "inline-flex", gap: 6 }}
            >
              {tag}
              <span style={{ color: "#5a6270" }}>{count}</span>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
