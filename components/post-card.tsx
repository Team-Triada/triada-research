import Link from "next/link";
import type { PostMeta } from "@/lib/content";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/${post.slug}`}
      className="group card-surface block min-w-0 overflow-hidden"
      style={{ textDecoration: "none" }}
    >
      <div style={{ aspectRatio: "1200 / 630", background: "#0a0b0d", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/${post.slug}/opengraph-image.png`}
          alt=""
          loading="lazy"
          className="transition-transform duration-300 group-hover:scale-[1.03]"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div style={{ padding: "18px 18px 20px" }}>
        <h2
          className="heading-card transition-colors group-hover:text-cyan"
          style={{ fontSize: 16.5, lineHeight: 1.4 }}
        >
          {post.title}
        </h2>
        <p
          className="line-clamp-2"
          style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.6, color: "#7a8190" }}
        >
          {post.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs" style={{ color: "#5a6270" }}>
          <span>{post.date}</span>
          <span style={{ color: "var(--border-strong)" }}>·</span>
          <span>{post.readingTime}</span>
        </div>

        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 11,
                  padding: "3px 9px",
                  borderRadius: 100,
                  border: "1px solid var(--border)",
                  color: "#7a8190",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
