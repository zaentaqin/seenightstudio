"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const COOKIE_NAME = "admin_session";

export async function login(formData: FormData) {
  const password = formData.get("password") as string;

  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    redirect("/admin");
  }

  redirect("/admin/login?error=Invalid+password");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin/login");
}
