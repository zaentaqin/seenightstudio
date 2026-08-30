import type { Metadata } from "next";
import "./globals.css";
import { allFontVariables } from "@/lib/product-fonts";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CursorFollower } from "@/components/cursor-follower";
import { ToastProvider } from "@/components/toast";
import { HideChrome } from "@/components/hide-chrome";
import { getSettings, getAllTags, getTypefaceMap } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL("https://seenight.studio"),
  title: {
    default: "See Night Studio — Independent Type Foundry",
    template: "%s — See Night Studio",
  },
  description:
    "See Night Studio is an independent type foundry drawing expressive retail and custom typefaces for brands that keep late hours.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [navSettings, tags, typefaceMap] = await Promise.all([
    getSettings("nav"),
    getAllTags(),
    getTypefaceMap(),
  ]);

  const navLinks = navSettings.links ?? [
    { label: "Fonts", href: "/fonts" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <html lang="en" className={allFontVariables} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-paper font-sans text-ink antialiased">
        <HideChrome />
        <ToastProvider>
          <CursorFollower />
          <Nav navLinks={navLinks} tags={tags} typefaceMap={typefaceMap} />
          <main>{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
