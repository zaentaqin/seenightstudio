import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { allFontVariables } from "@/lib/product-fonts";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CursorFollower } from "@/components/cursor-follower";
import { ToastProvider } from "@/components/toast";

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
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

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
        <ToastProvider>
          {!isAdmin && <CursorFollower />}
          {!isAdmin && <Nav />}
          <main>{children}</main>
          {!isAdmin && <Footer />}
        </ToastProvider>
      </body>
    </html>
  );
}
