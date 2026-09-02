import Link from "next/link";
import { getTypefaces } from "@/lib/data";
import { Plus, Pencil } from "lucide-react";

export default async function AdminTypefaces() {
  const typefaces = await getTypefaces();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase">
            Typefaces
          </h1>
          <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-ink/40 uppercase">
            {typefaces.length} typefaces
          </p>
        </div>
        <Link
          href="/admin/typefaces/new"
          className="flex items-center gap-2 border border-ink bg-ink px-4 py-2.5 text-xs font-bold tracking-[0.15em] uppercase text-paper transition-colors hover:border-accent hover:bg-accent"
        >
          <Plus className="h-4 w-4" />
          Add typeface
        </Link>
      </div>

      <div className="mt-8 border border-ink/15">
        <div className="grid grid-cols-12 gap-4 border-b border-ink/15 bg-ink/5 px-4 py-3 font-mono text-[9px] tracking-[0.2em] text-ink/50 uppercase md:px-6">
          <span className="col-span-3">Name</span>
          <span className="col-span-2">Category</span>
          <span className="col-span-1">Styles</span>
          <span className="col-span-1">Price</span>
          <span className="col-span-2">Designer</span>
          <span className="col-span-1">Year</span>
          <span className="col-span-1">File</span>
          <span className="col-span-1 text-right">Edit</span>
        </div>

        {typefaces.map((font) => (
          <div
            key={font.slug}
            className="grid grid-cols-12 items-center gap-4 border-b border-ink/10 px-4 py-3 transition-colors last:border-b-0 hover:bg-ink/5 md:px-6"
          >
            <span className="col-span-3 truncate text-sm font-bold">
              {font.name}
            </span>
            <span className="col-span-2 font-mono text-[10px] uppercase text-ink/60">
              {font.category}
            </span>
            <span className="col-span-1 font-mono text-[10px] text-ink/60">
              {font.styles}
            </span>
            <span className="col-span-1 font-mono text-[10px] text-accent">
              ${font.price}
            </span>
            <span className="col-span-2 truncate text-[10px] text-ink/60">
              {font.designer}
            </span>
            <span className="col-span-1 font-mono text-[10px] text-ink/60">
              {font.year}
            </span>
            <span className="col-span-1">
              {font.font_path ? (
                <span className="inline-block border border-accent/50 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.1em] text-accent uppercase">
                  {font.font_path.split(".").pop()}
                </span>
              ) : (
                <span className="font-mono text-[10px] text-ink/30">—</span>
              )}
            </span>
            <div className="col-span-1 flex justify-end">
              <Link
                href={`/admin/typefaces/${font.slug}`}
                className="p-1.5 text-ink/40 transition-colors hover:text-accent"
              >
                <Pencil className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}

        {typefaces.length === 0 && (
          <div className="px-4 py-12 text-center font-mono text-[10px] text-ink/40 uppercase">
            No typefaces found
          </div>
        )}
      </div>
    </>
  );
}
