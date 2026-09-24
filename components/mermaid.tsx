"use client";

import { useEffect, useId, useRef, useState } from "react";

let mermaidInitialized = false;

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "-");
  const renderCount = useRef(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // React Strict Mode double-invokes effects in dev, which would call
    // mermaid.render() twice concurrently with the same element id, and
    // the two in-flight D3 layouts collide on that shared id mid-render.
    // A fresh id per actual invocation keeps them fully independent.
    const renderId = `mermaid-${id}-${renderCount.current++}`;

    async function render() {
      const mermaid = (await import("mermaid")).default;

      if (!mermaidInitialized) {
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          // Deliberately not overriding fontFamily: mermaid measures label
          // text with a raw Canvas ctx.font call to lay out node sizes.
          // next/font generates a scoped internal name for "Inter" (not the
          // literal string), and Canvas font shorthand can't resolve our
          // CSS custom property either, so anything we pass here risks
          // measuring against a different font than what actually paints.
          // Mermaid's own default stack measures and paints consistently.
          // Keep HTML labels (the default): they wrap via real CSS
          // (white-space/max-width on the foreignObject's div). Pure-SVG
          // text labels don't reflow at all, long labels just get clipped
          // at the node edge instead of wrapping to a second line.
          flowchart: { htmlLabels: true, useMaxWidth: true },
          sequence: { useMaxWidth: true },
          themeVariables: {
            background: "#0a0b0d",
            primaryColor: "#1a1c1f",
            primaryTextColor: "#e8eaed",
            primaryBorderColor: "rgba(255,255,255,0.15)",
            lineColor: "#5a6270",
            secondaryColor: "#111315",
            tertiaryColor: "#0c0c0e",
            textColor: "#c0c5cc",
            mainBkg: "#111315",
            nodeBorder: "rgba(255,255,255,0.15)",
            clusterBkg: "#0c0c0e",
            clusterBorder: "rgba(255,255,255,0.1)",
            titleColor: "#e8eaed",
            edgeLabelBackground: "#111315",
            errorBkgColor: "#2a1215",
            errorTextColor: "#ff8a8a",
          },
        });
        mermaidInitialized = true;
      }

      const trimmed = chart.trim();

      // Validate before attempting to render. mermaid.render() builds into a
      // detached node internally and normally cleans it up itself, but on a
      // parse failure that cleanup isn't guaranteed, so we'd rather fail
      // before it ever creates anything.
      const valid = await mermaid.parse(trimmed, { suppressErrors: true });
      if (!valid) {
        if (!cancelled) setError(true);
        return;
      }

      try {
        const { svg } = await mermaid.render(renderId, trimmed);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("Mermaid render failed:", err);
        if (!cancelled) setError(true);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <div
        className="mb-5"
        style={{
          padding: 16,
          borderRadius: 10,
          border: "1px solid rgba(255,60,60,0.3)",
          background: "rgba(255,60,60,0.06)",
          color: "#ff8a8a",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
        }}
      >
        Diagram couldn&apos;t be rendered. Check the console for the parser error.
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="mermaid-diagram mb-5 flex justify-center overflow-x-auto"
      style={{
        padding: 20,
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: "#0a0b0d",
      }}
    />
  );
}
