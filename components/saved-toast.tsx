"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/components/toast";
import { CheckCircle } from "lucide-react";

const MESSAGES: Record<string, string> = {
  typeface: "Typeface saved successfully",
  page: "Page content saved successfully",
  settings: "Settings saved successfully",
  deleted: "Item deleted successfully",
};

export function SavedToast() {
  const searchParams = useSearchParams();
  const saved = searchParams.get("saved");
  const toast = useToast();

  useEffect(() => {
    if (saved) {
      const msg = MESSAGES[saved] ?? "Changes saved successfully";
      toast(msg);
      // Remove ?saved= from URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete("saved");
      window.history.replaceState({}, "", url.toString());
    }
  }, [saved, toast]);

  return null;
}
