"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { logout } from "@/app/admin/actions/auth";
import {
  LayoutDashboard,
  Type,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Typefaces", href: "/admin/typefaces", icon: Type },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Mobile top bar with toggle */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-3 border-b border-ink/15 bg-paper md:hidden">
        <button
          onClick={toggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-14 w-14 shrink-0 items-center justify-center transition-colors hover:bg-ink/5"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <Link
          href="/admin"
          onClick={close}
          className="group flex items-center gap-2 text-sm font-bold tracking-tighter uppercase"
        >
          <span className="inline-block h-2 w-2 bg-accent transition-transform group-hover:rotate-45" />
          See Night
          <span className="font-mono text-[9px] tracking-normal text-ink/40">
            admin
          </span>
        </Link>
      </div>

      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-ink/30 transition-opacity duration-200 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar drawer */}
      <aside
        className={`fixed bottom-0 left-0 top-14 z-40 flex w-60 flex-col border-r border-ink/15 bg-paper transition-transform duration-200 ease-in-out md:top-0 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="hidden border-b border-ink/15 px-5 py-5 md:block">
          <Link
            href="/admin"
            onClick={close}
            className="group flex items-center gap-2 text-sm font-bold tracking-tighter uppercase"
          >
            <span className="inline-block h-2 w-2 bg-accent transition-transform group-hover:rotate-45" />
            See Night
            <span className="font-mono text-[9px] tracking-normal text-ink/40">
              admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {links.map((link) => {
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-ink text-paper"
                        : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-1 border-t border-ink/15 px-3 py-3">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <ExternalLink className="h-4 w-4" />
            View site
          </a>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5 hover:text-accent"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}