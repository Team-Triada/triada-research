import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container style={{ paddingTop: 120, paddingBottom: 120, textAlign: "center" }}>
      <span className="section-label">404</span>
      <h1 className="heading-section">Page not found</h1>
      <p className="mt-4" style={{ color: "#a8adb5", fontSize: 15 }}>
        This page doesn&apos;t exist, or it moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className="btn-primary" style={{ fontSize: 14, padding: "12px 24px" }}>
          Back to home
        </Link>
        <Link href="/research" style={{ fontSize: 13, color: "#5a6270", textDecoration: "none" }}>
          Browse all research →
        </Link>
      </div>
    </Container>
  );
}
