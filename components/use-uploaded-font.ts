"use client";

import { useEffect, useState } from "react";

export type FontLoadState = "idle" | "loading" | "ready" | "error";

/**
 * Registers a real font file (OTF/TTF/WOFF2) as a FontFace so elements can
 * render with it. The face is registered with a variable weight range
 * (100–900) so variable fonts respond to font-weight sliders; static faces
 * simply render at their single weight.
 */
export function useUploadedFont(
  familyName: string | null,
  url: string | null,
): FontLoadState {
  const [state, setState] = useState<FontLoadState>("idle");

  useEffect(() => {
    if (!familyName || !url) return;

    let cancelled = false;

    (async () => {
      if (cancelled) return;
      if ("fonts" in document && document.fonts.check(`16px "${familyName}"`)) {
        setState("ready");
        return;
      }
      setState("loading");

      try {
        const face = new FontFace(familyName, `url(${url})`, {
          weight: "100 900",
          style: "normal",
        });
        const loaded = await face.load();
        if (cancelled) return;
        document.fonts.add(loaded);
        setState("ready");
      } catch {
        if (!cancelled) setState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [familyName, url]);

  return state;
}