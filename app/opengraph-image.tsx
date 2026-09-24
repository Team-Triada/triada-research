import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "TRIADA Research";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function Image() {
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
            "radial-gradient(circle at 15% 15%, rgba(255,60,60,0.16), transparent 45%)",
          padding: 80,
        }}
      >
        <img src={logoSrc} height={40} style={{ objectFit: "contain" }} alt="" />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#7a8190",
              marginBottom: 20,
            }}
          >
            Team Triada
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 600,
              color: "#ff3c3c",
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Research
          </div>
          <div style={{ fontSize: 26, color: "#a8adb5", marginTop: 20, maxWidth: 900 }}>
            CTF postmortems, offensive and defensive write-ups, and vulnerability research.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
