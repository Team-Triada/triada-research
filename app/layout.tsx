import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, organizationSchema } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | TRIADA Research",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Team Triada", url: "https://triada.in" }],
  creator: "Team Triada",
  publisher: "Team Triada",
  keywords: [
    "cybersecurity research",
    "CTF writeups",
    "vulnerability research",
    "penetration testing blog",
    "security whitepapers",
    "Team Triada",
    "CVE analysis",
    "bug bounty writeups",
  ],
  icons: {
    icon: [{ url: "/images/favicon.png", type: "image/png" }],
    shortcut: "/images/favicon.png",
    apple: [{ url: "/images/triada_logo.png", sizes: "382x400", type: "image/png" }],
  },
  alternates: {
    canonical: SITE_URL,
    types: { "application/rss+xml": "/feed.xml" },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    site: "@teamtriada",
    creator: "@teamtriada",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0c0c0e",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "en-IN",
  publisher: organizationSchema,
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${SITE_URL}/#blog`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: organizationSchema,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="dark">
      <head>
        {/*
          Static export has no server, so this <meta> tag is the only piece
          of the old next.config.ts headers() that survives. HSTS,
          X-Frame-Options, and Permissions-Policy have no meta-tag
          equivalent and GitHub Pages doesn't support custom HTTP headers,
          so those are simply not enforceable on this host.
        */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={`default-src 'self'; script-src 'self' 'unsafe-inline'${
            process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : ""
          }; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'; object-src 'none'`}
        />
        <link rel="preload" href="/fonts/Telegraf-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrains.variable} flex min-h-screen flex-col antialiased`}>
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
