import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  query = {},
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  /** extra query params to preserve across page links, e.g. { tag: "ssrf" } */
  query?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-between">
      {currentPage > 1 ? (
        <Link href={hrefFor(currentPage - 1)} className="pill-tag" style={{ textDecoration: "none" }}>
          ← Newer
        </Link>
      ) : (
        <span />
      )}

      <span className="font-mono text-xs" style={{ color: "#5a6270" }}>
        page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link href={hrefFor(currentPage + 1)} className="pill-tag" style={{ textDecoration: "none" }}>
          Older →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
