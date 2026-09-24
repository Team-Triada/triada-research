import Link from "next/link";
import Image from "next/image";
import { Container } from "./container";

export function Nav() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        background: "rgba(12,12,14,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Container
        as="nav"
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3"
        style={{ paddingTop: 14, paddingBottom: 14 }}
      >
        <Link href="/" className="flex shrink-0 items-center gap-3" style={{ textDecoration: "none" }} aria-label="TRIADA Research home">
          <Image
            src="/images/Triada_typo.png"
            alt="TRIADA"
            width={157}
            height={20}
            style={{ height: 16, width: "auto", objectFit: "contain" }}
          />
          <span
            className="hidden sm:inline"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
              color: "#7a8190",
              textTransform: "uppercase",
              borderLeft: "1px solid rgba(255,255,255,0.12)",
              paddingLeft: 12,
            }}
          >
            Research
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/research" style={{ fontSize: 13.5, color: "#a8adb5", textDecoration: "none" }}>
            Research
          </Link>
          <a
            href="https://triada.in"
            className="btn-primary"
            style={{ fontSize: 13, padding: "8px 16px", minHeight: "unset" }}
          >
            triada.in →
          </a>
        </div>
      </Container>
    </header>
  );
}
