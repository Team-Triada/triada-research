import Link from "next/link";
import { GithubLogo, InstagramLogo, LinkedinLogo, RssSimple } from "@phosphor-icons/react/dist/ssr";
import { Container } from "./container";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/team-Triada", Icon: GithubLogo },
  { label: "Instagram", href: "https://www.instagram.com/team_triada/", Icon: InstagramLogo },
  { label: "LinkedIn", href: "https://in.linkedin.com/company/teamtriada", Icon: LinkedinLogo },
  { label: "RSS feed", href: "/feed.xml", Icon: RssSimple },
];

export function Footer() {
  return (
    <footer className="mt-auto" style={{ background: "#08090b", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ height: 2, background: "linear-gradient(90deg, transparent 0%, #ff3c3c 30%, #ff6040 60%, transparent 100%)" }} />

      <Container
        className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        style={{ paddingTop: 40, paddingBottom: 24 }}
      >
        <div>
          <Link href="/" style={{ textDecoration: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- needs a CSS brightness/invert filter next/image doesn't expose cleanly */}
            <img
              src="/images/Triada_typo.png"
              alt="TRIADA"
              width={293}
              height={37}
              style={{ height: 18, width: "auto", filter: "brightness(0) invert(1)" }}
            />
          </Link>
          <p style={{ fontSize: 13, color: "#7a8190", marginTop: 10, maxWidth: 340 }}>
            Research from Team Triada, a student-led cybersecurity collective.
          </p>
        </div>

        <div className="flex gap-2">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#7a8190",
              }}
            >
              <Icon size={15} />
            </a>
          ))}
        </div>
      </Container>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <Container
          className="flex flex-wrap items-center justify-between gap-2"
          style={{
            paddingTop: 14,
            paddingBottom: 14,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "#5a6270",
            letterSpacing: "0.06em",
          }}
        >
          <span>© {new Date().getFullYear()} TRIADA. All Rights Reserved.</span>
          <a href="https://triada.in" style={{ color: "#5a6270", textDecoration: "none" }}>
            triada.in
          </a>
        </Container>
      </div>
    </footer>
  );
}
