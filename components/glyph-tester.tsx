"use client";

import { useState } from "react";

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&@§?!%*()".split(
    "",
  );

function unicodeOf(glyph: string): string {
  return `U+${glyph.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0")}`;
}

export function GlyphTester({ fontVar }: { fontVar: string }) {
  const [selected, setSelected] = useState("A");

  return (
    <div className="grid grid-cols-1 gap-px border-x border-b border-ink/15 bg-ink/15 lg:grid-cols-12">
      {/* Preview panel */}
      <div className="flex min-h-[300px] flex-col justify-between bg-paper p-6 md:p-8 lg:col-span-5">
        <span className="font-mono text-[9px] tracking-[0.25em] text-ink/50 uppercase">
          Selected glyph
        </span>

        <p
          className="my-6 self-center leading-none select-none [font-size:clamp(8rem,14vw,14rem)]"
          style={{ fontFamily: `var(${fontVar})` }}
          aria-live="polite"
        >
          {selected}
        </p>

        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase">
          <span className="text-accent">{unicodeOf(selected)}</span>
          <span className="text-ink/40">Click a cell →</span>
        </div>
      </div>

      {/* Glyph grid */}
      <div
        role="group"
        aria-label="Glyph set"
        className="grid grid-cols-6 gap-px bg-ink/15 sm:grid-cols-8 lg:col-span-7"
      >
        {GLYPHS.map((glyph) => {
          const isActive = selected === glyph;
          return (
            <button
              key={glyph}
              type="button"
              onClick={() => setSelected(glyph)}
              aria-label={`Preview glyph ${glyph}`}
              aria-pressed={isActive}
              className={`flex aspect-square items-center justify-center transition-colors duration-150 ${
                isActive
                  ? "bg-accent text-paper"
                  : "bg-paper hover:bg-ink hover:text-paper"
              }`}
              style={{
                fontFamily: `var(${fontVar})`,
                fontSize: "clamp(1.5rem, 3vw, 2.75rem)",
              }}
            >
              {glyph}
            </button>
          );
        })}
      </div>
    </div>
  );
}
