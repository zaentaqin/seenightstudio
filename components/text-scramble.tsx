"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

function scrambleText(text: string, frame: number, total: number): string {
  return text
    .split("")
    .map((char, i) => {
      if (char === " ") return " ";
      if (i < (frame / total) * text.length) return text[i];
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    })
    .join("");
}

export function TextScramble({
  text,
  className = "",
  style,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: "span" | "p" | "div";
}) {
  const [display, setDisplay] = useState(text);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const frameRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const start = useCallback(() => {
    clearTimeout(timeoutRef.current);
    frameRef.current = 0;

    const total = 8;
    const tick = () => {
      frameRef.current += 1;
      if (frameRef.current >= total) {
        setDisplay(text);
        return;
      }
      setDisplay(scrambleText(text, frameRef.current, total));
      timeoutRef.current = setTimeout(tick, 30);
    };

    setDisplay(scrambleText(text, 0, total));
    timeoutRef.current = setTimeout(tick, 30);
  }, [text]);

  const stop = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setDisplay(text);
  }, [text]);

  return (
    <Tag
      className={className}
      style={style}
      onMouseEnter={start}
      onMouseLeave={stop}
    >
      {display}
    </Tag>
  );
}
