"use client";

import { useRef, useState, type HTMLAttributes } from "react";
import { Copy, Check } from "@phosphor-icons/react/dist/ssr";

type PreProps = HTMLAttributes<HTMLPreElement> & { "data-language"?: string };

export function Pre({ children, "data-language": language, ...rest }: PreProps) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = ref.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked, nothing to do here
    }
  }

  return (
    <div className="code-card">
      <button
        type="button"
        className="code-card-copy"
        onClick={handleCopy}
        aria-label="Copy code"
        title={copied ? "Copied" : "Copy"}
      >
        {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
      </button>
      <pre ref={ref} data-language={language} {...rest}>
        {children}
      </pre>
    </div>
  );
}
