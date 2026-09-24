import type { NextConfig } from "next";

// Static export for GitHub Pages: no Node server, so headers(), ISR, and the
// default next/image optimizer are all unavailable. See lib/seo.ts's CSP meta
// tag in app/layout.tsx for what could be preserved statically (CSP only,
// via <meta http-equiv>; GitHub Pages doesn't support custom HTTP headers at
// all, so HSTS/X-Frame-Options/Permissions-Policy have no static equivalent).
const nextConfig: NextConfig = {
  output: "export",
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
