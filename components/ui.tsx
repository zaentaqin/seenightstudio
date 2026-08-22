import type { ReactNode } from "react";

/**
 * Full-width meta strip at the top of a page: small mono uppercase spans
 * spread edge-to-edge above the first section divider.
 */
export function PageBar({
  children,
  subtle = false,
}: {
  children: ReactNode;
  /** Softer divider used on the home hero bar. */
  subtle?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 border-b py-4 font-mono text-[10px] tracking-[0.2em] uppercase ${
        subtle ? "border-ink/15" : "border-ink"
      }`}
    >
      {children}
    </div>
  );
}

/** Numbered mono label introducing a page section, e.g. “01 / Try it live”. */
export function SectionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`border-b border-ink pb-4 font-mono text-[10px] tracking-[0.25em] uppercase ${className}`}
    >
      {children}
    </h2>
  );
}
