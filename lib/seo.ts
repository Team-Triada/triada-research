export const SITE_URL = "https://research.triada.in";
export const SITE_NAME = "TRIADA Research";
export const SITE_DESCRIPTION =
  "Blog, whitepapers, and research from Team Triada: offensive and defensive security write-ups, CTF postmortems, and vulnerability research.";

// Inlined in full everywhere it's used (never referenced by a bare @id):
// research.triada.in and triada.in are different origins, and structured-data
// parsers don't merge @id references across domains, so a sparse
// { "@id": "https://triada.in/#organization" } on its own would just be dropped.
export const organizationSchema = {
  "@type": "Organization" as const,
  "@id": "https://triada.in/#organization",
  name: "TRIADA",
  url: "https://triada.in",
  logo: { "@type": "ImageObject" as const, url: "https://triada.in/images/triada_logo.png" },
};

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
