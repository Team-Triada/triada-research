import { visit } from "unist-util-visit";
import type { Root, Code } from "mdast";

/**
 * Rewrites ```mermaid code fences into <Mermaid chart="..." /> JSX nodes
 * in the remark AST, before rehype-pretty-code/shiki ever sees them.
 *
 * Shiki has a bundled "mermaid" grammar for syntax-highlighting diagram
 * source as text, which is not what we want here, and reconstructing the
 * raw diagram source from its highlighted span tree at render time is
 * lossy (whitespace/token boundaries don't round-trip cleanly). Diverting
 * the code node before it reaches that stage keeps the source exact.
 */
export function remarkMermaid() {
  return (tree: Root) => {
    visit(tree, "code", (node: Code, index, parent) => {
      if (node.lang !== "mermaid" || !parent || index == null) return;

      Object.assign(node, {
        type: "mdxJsxFlowElement",
        name: "Mermaid",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "chart",
            value: node.value,
          },
        ],
        children: [],
      });
    });
  };
}
