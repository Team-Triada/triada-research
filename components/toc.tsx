"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/content";

export function Toc({ entries }: { entries: TocEntry[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    if (entries.length === 0) return;

    const headingEls = entries
      .map((e) => document.getElementById(e.slug))
      .filter((el): el is HTMLElement => el !== null);

    if (headingEls.length === 0) return;

    const observer = new IntersectionObserver(
      (observedEntries) => {
        for (const entry of observedEntries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );

    headingEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="sticky top-28">
      <span className="section-label" style={{ marginBottom: 14 }}>
        On this page
      </span>
      <ul className="relative flex flex-col gap-1" style={{ borderLeft: "1px solid var(--border)" }}>
        {entries.map((e) => {
          const active = e.slug === activeSlug;
          return (
            <li key={e.slug}>
              <a
                href={`#${e.slug}`}
                className="block py-1 transition-colors"
                style={{
                  marginLeft: -1,
                  paddingLeft: e.depth === 3 ? 28 : 14,
                  borderLeft: active ? "2px solid var(--triada-cyan)" : "2px solid transparent",
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: active ? "#ffffff" : "#7a8190",
                }}
              >
                {e.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
