import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "See Night Studio is an independent type foundry in Jakarta drawing retail and custom typefaces for brands that keep late hours.",
};

const values = [
  {
    index: "01",
    title: "Spacing is sacred",
    desc: "We will delay a release by a month to fix a single kerning pair. Clients notice. Readers feel it even if they never know why.",
  },
  {
    index: "02",
    title: "Personality over neutrality",
    desc: "The world has enough geometric sans. Every family we ship must have at least one detail that makes a designer smirk.",
  },
  {
    index: "03",
    title: "Drawn, then engineered",
    desc: "Letter first, outlines second, OpenType features third — but all three, always. Beauty that breaks in InDesign is not beauty.",
  },
  {
    index: "04",
    title: "Open process",
    desc: "Works in progress get published, rejected sketches stay visible. Type design looks like magic only when you hide the work.",
  },
];

const team = [
  { initials: "SN", name: "Sena Nakula", role: "Founder · Type Design" },
  { initials: "RA", name: "Rara Adhista", role: "Partner · Display & Script" },
  { initials: "DP", name: "Dimas Prayoga", role: "Engineer · Variable & Tooling" },
];

const clients = [
  "Midnight Records",
  "Kopiright Coffee",
  "Studio Larut",
  "Bulan Journal",
  "Nightshift FM",
  "Pasar Seni Digital",
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink py-4 font-mono text-[10px] tracking-[0.2em] uppercase">
          <span>About</span>
          <span>Independent since 2019</span>
          <span className="hidden sm:inline">Jakarta, Indonesia</span>
        </div>

        {/* Manifesto */}
        <h1 className="py-16 leading-[1.02] font-bold tracking-tight uppercase [font-size:clamp(2.25rem,6.5vw,6.5rem)] md:py-24">
          We are a foundry{" "}
          <span className="text-outline">for the dark hours</span> — drawing
          letters with more personality than any layout can contain.
        </h1>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-[1600px] px-4 pb-16 md:px-8">
        <h2 className="border-b border-ink pb-4 font-mono text-[10px] tracking-[0.25em] uppercase">
          01 / What we believe
        </h2>
        <div className="border-x border-b border-ink/15">
          {values.map((v) => (
            <div
              key={v.index}
              className="group grid grid-cols-12 gap-4 border-b border-ink/15 px-4 py-10 transition-colors last:border-b-0 hover:bg-ink hover:text-paper md:px-8"
            >
              <span className="col-span-2 font-mono text-[10px] tracking-[0.2em] text-ink/40 group-hover:text-paper/40 md:col-span-1">
                {v.index}
              </span>
              <h3 className="col-span-10 text-xl font-bold tracking-tight uppercase md:col-span-4 md:text-2xl">
                {v.title}
              </h3>
              <p className="col-span-11 col-start-3 max-w-xl text-sm leading-relaxed text-ink/60 group-hover:text-paper/60 md:col-span-6 md:col-start-7">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-[1600px] px-4 pb-16 md:px-8">
        <h2 className="border-b border-ink pb-4 font-mono text-[10px] tracking-[0.25em] uppercase">
          02 / The night shift
        </h2>
        <div className="grid grid-cols-1 gap-px border-x border-b border-ink/15 bg-ink/15 sm:grid-cols-3">
          {team.map((member) => (
            <div key={member.name} className="bg-paper p-8">
              <div
                className="flex aspect-square items-center justify-center border border-ink/20 bg-ink text-paper select-none [font-size:clamp(4rem,8vw,7rem)]"
                aria-hidden
              >
                <span className="font-bold tracking-tighter">{member.initials}</span>
              </div>
              <p className="mt-5 text-lg font-bold tracking-tight uppercase">
                {member.name}
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-ink/50 uppercase">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Clients + CTA */}
      <section className="mx-auto max-w-[1600px] px-4 pb-24 md:px-8">
        <h2 className="border-b border-ink pb-4 font-mono text-[10px] tracking-[0.25em] uppercase">
          03 / Seen in
        </h2>
        <ul className="grid grid-cols-1 divide-y divide-ink/15 border-b border-ink/15 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <li
              key={client}
              className="flex items-center justify-between py-4 text-sm font-medium"
            >
              {client}
              <ArrowUpRight className="h-4 w-4 text-ink/30" />
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border border-ink p-8 md:flex-row md:items-center md:p-12">
          <p className="max-w-lg text-2xl leading-tight font-bold tracking-tight uppercase md:text-4xl">
            Need letterforms that are yours alone?
          </p>
          <Link
            href="/contact"
            className="shrink-0 border border-ink px-6 py-4 text-xs font-medium tracking-[0.25em] uppercase transition-colors hover:bg-accent hover:text-paper"
          >
            Start a custom project →
          </Link>
        </div>
      </section>
    </>
  );
}
