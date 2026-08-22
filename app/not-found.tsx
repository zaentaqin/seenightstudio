import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[1600px] flex-col justify-center px-4 py-16 md:px-8">
      <p className="font-mono text-[10px] tracking-[0.25em] text-ink/50 uppercase">
        Error 404 — lost in the dark
      </p>
      <h1 className="py-8 leading-[0.85] font-bold tracking-tighter uppercase select-none [font-size:clamp(4rem,16vw,16rem)]">
        <span className="block">Not</span>
        <span className="text-outline block">Found</span>
      </h1>
      <Link
        href="/"
        className="w-fit border border-ink px-6 py-4 text-xs font-medium tracking-[0.25em] uppercase transition-colors hover:bg-ink hover:text-paper"
      >
        Back to daylight →
      </Link>
    </section>
  );
}
