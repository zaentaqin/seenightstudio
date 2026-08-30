"use client";

import { usePathname } from "next/navigation";

export function HideChrome() {
  const pathname = usePathname();
  if (!pathname.startsWith("/admin")) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `header,footer{display:none!important}`,
      }}
    />
  );
}
