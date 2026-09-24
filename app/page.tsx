import Link from "next/link";
import { getAllPosts } from "@/lib/content";
import { PostGrid } from "@/components/post-grid";
import { Container } from "@/components/container";

export default function Home() {
  const latest = getAllPosts().slice(0, 3);

  return (
    <>
      <Container style={{ paddingTop: 96, paddingBottom: 64 }}>
        <span className="section-label">Team Triada</span>
        <h1 className="heading-hero">Research</h1>
        <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed" style={{ color: "#a8adb5" }}>
          CTF postmortems, offensive and defensive write-ups, and vulnerability research from
          the Team Triada security club.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/research" className="btn-primary" style={{ fontSize: 14, padding: "12px 24px" }}>
            Browse all research →
          </Link>
          <a href="https://triada.in" style={{ fontSize: 13, color: "#5a6270", textDecoration: "none" }}>
            About Team Triada
          </a>
        </div>
      </Container>

      {latest.length > 0 && (
        <Container style={{ paddingBottom: 96 }}>
          <div className="flex items-baseline justify-between" style={{ marginBottom: 24 }}>
            <span className="section-label" style={{ marginBottom: 0 }}>
              Latest
            </span>
            <Link href="/research" style={{ fontSize: 13, color: "#5a6270", textDecoration: "none" }}>
              View all →
            </Link>
          </div>
          <PostGrid posts={latest} />
        </Container>
      )}
    </>
  );
}
