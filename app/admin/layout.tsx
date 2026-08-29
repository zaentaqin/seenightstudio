import type { Metadata } from "next";
import { isAdmin } from "@/app/admin/actions/is-admin";
import { AdminSidebar } from "@/components/admin/sidebar";

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
  const authenticated = await isAdmin();

  if (!authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-paper">
      <AdminSidebar />
      <main className="ml-60 p-8">{children}</main>
    </div>
  );
}
