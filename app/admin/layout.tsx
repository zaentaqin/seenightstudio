import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/sidebar";
import { SavedToast } from "@/components/saved-toast";

export const metadata: Metadata = {
  title: {
    default: "Admin — See Night Studio",
    template: "%s — See Night Admin",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let authenticated = false;
  try {
    const { isAdmin } = await import("@/app/admin/actions/is-admin");
    authenticated = await isAdmin();
  } catch {
    /* cookie read failed — treat as unauthenticated */
  }

  if (!authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen md:ml-60">
      <SavedToast />
      <AdminSidebar />
      <main className="p-4 pt-14 md:p-8 md:pt-8">{children}</main>
    </div>
  );
}
