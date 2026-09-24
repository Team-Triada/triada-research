"use client";

import { useMemo, useState } from "react";
import { PostGrid } from "./post-grid";
import type { PostMeta } from "@/lib/content";

const PAGE_SIZE = 9;

export function ResearchBrowser({
  posts,
  tags,
}: {
  posts: PostMeta[];
  tags: { tag: string; count: number }[];
}) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(
    () => (selectedTag ? posts.filter((p) => p.tags.includes(selectedTag)) : posts),
    [posts, selectedTag]
  );

  function selectTag(tag: string | null) {
    setSelectedTag(tag);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <>
      <div className="tag-scroll-wrap mt-8">
        <div className="tag-scroll">
          <button
            type="button"
            onClick={() => selectTag(null)}
            className="pill-tag"
            style={{
              cursor: "pointer",
              borderColor: selectedTag ? undefined : "var(--triada-cyan)",
              color: selectedTag ? undefined : "#ffffff",
            }}
          >
            All
          </button>
          {tags.map(({ tag, count }) => (
            <button
              key={tag}
              type="button"
              onClick={() => selectTag(tag)}
              className="pill-tag"
              style={{
                cursor: "pointer",
                gap: 6,
                borderColor: selectedTag === tag ? "var(--triada-cyan)" : undefined,
                color: selectedTag === tag ? "#ffffff" : undefined,
              }}
            >
              {tag}
              <span style={{ color: "#5a6270" }}>{count}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-sm" style={{ color: "#5a6270" }}>
          No posts tagged &ldquo;{selectedTag}&rdquo; yet.
        </p>
      ) : (
        <>
          <PostGrid posts={filtered.slice(0, visibleCount)} className="mt-12" />
          {visibleCount < filtered.length && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="pill-tag"
                style={{ cursor: "pointer", padding: "10px 22px" }}
              >
                Load more ({filtered.length - visibleCount} left)
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
