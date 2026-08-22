"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlignCenter, AlignLeft } from "lucide-react";

type Props = {
  fontVar: string;
  initialText: string;
  weightRange?: [number, number];
  defaultWeight: number;
  hasItalic: boolean;
};

const WEIGHT_NAMES: Record<number, string> = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black",
};

export function TypeTester({
  fontVar,
  initialText,
  weightRange,
  defaultWeight,
  hasItalic,
}: Props) {
  const [text, setText] = useState(initialText);
  const [size, setSize] = useState(96);
  const [weight, setWeight] = useState(defaultWeight);
  const [align, setAlign] = useState<"left" | "center">("left");
  const [uppercase, setUppercase] = useState(false);
  const [italic, setItalic] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const fitHeight = useCallback(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    fitHeight();
  }, [text, size, uppercase, fitHeight]);

  return (
    <div className="border-x border-b border-ink/15">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-ink/15 px-4 py-4 md:px-8">
        <label className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
            Size
          </span>
          <input
            type="range"
            min={24}
            max={220}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-32 accent-ink md:w-44"
            aria-label="Font size"
          />
          <span className="w-12 font-mono text-[10px] tabular-nums">
            {size}px
          </span>
        </label>

        {weightRange && (
          <label className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
              Wght
            </span>
            <input
              type="range"
              min={weightRange[0]}
              max={weightRange[1]}
              step={50}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-32 accent-ink md:w-44"
              aria-label="Font weight"
            />
            <span className="w-20 font-mono text-[10px] tabular-nums">
              {WEIGHT_NAMES[weight] ?? weight}
            </span>
          </label>
        )}

        <div className="flex items-center gap-1">
          {(
            [
              ["left", AlignLeft],
              ["center", AlignCenter],
            ] as const
          ).map(([mode, Icon]) => (
            <button
              key={mode}
              type="button"
              onClick={() => setAlign(mode)}
              aria-label={`Align ${mode}`}
              aria-pressed={align === mode}
              className={`flex h-8 w-8 items-center justify-center border transition-colors ${
                align === mode
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/25 hover:border-ink"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setUppercase((v) => !v)}
            aria-pressed={uppercase}
            className={`h-8 border px-2.5 font-mono text-[11px] tracking-widest transition-colors ${
              uppercase
                ? "border-ink bg-ink text-paper"
                : "border-ink/25 hover:border-ink"
            }`}
          >
            AA
          </button>
          {hasItalic && (
            <button
              type="button"
              onClick={() => setItalic((v) => !v)}
              aria-pressed={italic}
              className={`h-8 border px-3 font-serif text-sm italic transition-colors ${
                italic
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/25 hover:border-ink"
              }`}
            >
              It
            </button>
          )}
        </div>

        <span className="ml-auto hidden font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase md:inline">
          Type below ↓
        </span>
      </div>

      {/* Canvas */}
      <textarea
        ref={areaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        rows={2}
        className="block w-full resize-none overflow-hidden border-none bg-transparent px-4 py-8 leading-[1.08] break-words outline-none md:px-8"
        style={{
          fontFamily: `var(${fontVar})`,
          fontSize: `${size}px`,
          fontWeight: weight,
          textAlign: align,
          textTransform: uppercase ? "uppercase" : "none",
          fontStyle: italic ? "italic" : "normal",
        }}
        aria-label="Type tester canvas"
      />

      <div className="flex justify-between border-t border-ink/15 px-4 py-3 font-mono text-[10px] tracking-[0.15em] text-ink/40 uppercase md:px-8">
        <span>Live preview — rendered in your browser</span>
        <span>
          {WEIGHT_NAMES[weight] ?? weight} / {size}px
        </span>
      </div>
    </div>
  );
}

export { WEIGHT_NAMES };
