import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getPost, getSlugs } from "@/lib/content";

export const alt = "TRIADA Research";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  const logoData = await readFile(join(process.cwd(), "public/images/Triada_typo.png"), "base64");
  const logoSrc = `data:image/png;base64,${logoData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0c0e",
          backgroundImage:
            "radial-gradient(circle at 85% 10%, rgba(255,60,60,0.16), transparent 45%)",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} height={34} style={{ objectFit: "contain" }} alt="" />
          {post.tags[0] && (
            <div
              style={{
                fontSize: 20,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#ff3c3c",
              }}
            >
              {post.tags[0]}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: post.title.length > 60 ? 52 : 64,
              fontWeight: 600,
              color: "#f5f6f7",
              lineHeight: 1.15,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            {post.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 32, fontSize: 22, color: "#7a8190" }}>
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
