import type { ElementType, HTMLAttributes } from "react";

// Single shared width for nav, footer, and every page's content column.
// Keeping this in one place is what keeps their left/right edges aligned.
export const CONTAINER_WIDTH = 1280;

export function Container({
  as: As = "div",
  className = "",
  style,
  ...props
}: HTMLAttributes<HTMLElement> & { as?: ElementType }) {
  return (
    <As
      className={`mx-auto px-6 sm:px-10 ${className}`}
      style={{ maxWidth: CONTAINER_WIDTH, ...style }}
      {...props}
    />
  );
}
