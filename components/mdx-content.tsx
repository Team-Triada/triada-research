import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import type { AnchorHTMLAttributes, HTMLAttributes, ImgHTMLAttributes } from "react";
import { Pre } from "./mdx-pre";

const components = {
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="heading-section scroll-mt-28"
      style={{ fontSize: 26, marginTop: 56, marginBottom: 20 }}
      {...props}
    />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="scroll-mt-28 font-semibold"
      style={{
        fontFamily: "var(--font-inter)",
        fontSize: 19,
        color: "#e8eaed",
        marginTop: 40,
        marginBottom: 16,
      }}
      {...props}
    />
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-[1.8]" style={{ color: "#c0c5cc", fontSize: 16, marginBottom: 20 }} {...props} />
  ),
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-cyan underline underline-offset-4 decoration-[rgba(255,60,60,0.4)] hover:decoration-current" {...props} />
  ),
  img: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="rounded-lg"
      style={{ maxWidth: "100%", height: "auto", border: "1px solid var(--border)", marginBottom: 20 }}
      loading="lazy"
      {...props}
    />
  ),
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc space-y-2.5 pl-6 leading-[1.75]"
      style={{ color: "#c0c5cc", fontSize: 16, marginBottom: 20 }}
      {...props}
    />
  ),
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal space-y-2.5 pl-6 leading-[1.75]"
      style={{ color: "#c0c5cc", fontSize: 16, marginBottom: 20 }}
      {...props}
    />
  ),
  li: (props: HTMLAttributes<HTMLLIElement>) => <li className="pl-1" {...props} />,
  strong: (props: HTMLAttributes<HTMLElement>) => (
    <strong style={{ color: "var(--triada-cyan)", fontWeight: 600 }} {...props} />
  ),
  code: (props: HTMLAttributes<HTMLElement> & { "data-language"?: string }) => {
    if ("data-language" in props) {
      // part of a highlighted block from rehype-pretty-code, leave token spans alone
      return <code {...props} />;
    }
    return (
      <code
        className="rounded-md px-2 py-0.5 text-[0.85em]"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border-strong)",
          color: "#e8eaed",
          fontFamily: "var(--font-mono)",
        }}
        {...props}
      />
    );
  },
  pre: Pre,
  blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="py-1 pl-5 italic leading-[1.75]"
      style={{ borderLeft: "2px solid var(--triada-cyan)", color: "#9098a3", fontSize: 16, marginBottom: 20 }}
      {...props}
    />
  ),
  hr: () => <hr style={{ borderColor: "var(--border)", marginBottom: 20 }} />,
  table: (props: HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto" style={{ marginBottom: 20 }}>
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="px-3 py-2 text-left font-medium"
      style={{ border: "1px solid var(--border)", background: "var(--card)", color: "#e8eaed" }}
      {...props}
    />
  ),
  td: (props: HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-3 py-2" style={{ border: "1px solid var(--border)", color: "#c0c5cc" }} {...props} />
  ),
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="mdx-body">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypePrettyCode,
                {
                  theme: "github-dark",
                  keepBackground: false,
                  defaultLang: "text",
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
