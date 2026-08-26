import type { Metadata } from "next";
import "./globals.css";
import { allFontVariables } from "@/lib/product-fonts";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CursorFollower } from "@/components/cursor-follower";

export const metadata: Metadata = {
  metadataBase: new URL("https://seenight.studio"),
  title: {
    default: "See Night Studio — Independent Type Foundry",
    template: "%s — See Night Studio",
  },
  description:
    "See Night Studio is an independent type foundry drawing expressive retail and custom typefaces for brands that keep late hours.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
        <CursorFollower />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
