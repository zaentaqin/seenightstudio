"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions/auth";
import {
  LayoutDashboard,
  Type,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Typefaces", href: "/admin/typefaces", icon: Type },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 z-40 flex h-full w-60 flex-col border-r border-ink/15 bg-paper">
      <div className="border-b border-ink/15 px-5 py-5">
        <Link
          href="/admin"
          className="group flex items-center gap-2 text-sm font-bold tracking-tighter uppercase"
        >
          <span className="inline-block h-2 w-2 bg-accent transition-transform group-hover:rotate-45" />
          See Night
          <span className="font-mono text-[9px] text-ink/40 tracking-normal">
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

      <div className="border-t border-ink/15 px-3 py-3 space-y-1">
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
  );
}
