import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to See Night Studio about licenses, custom typefaces, or collaborations.",
};

const channels = [
  {
    label: "General & licensing",
    value: "hello@seenight.studio",
    href: "mailto:hello@seenight.studio",
  },
  {
    label: "Custom projects",
    value: "custom@seenight.studio",
    href: "mailto:custom@seenight.studio",
  },
];

const socials = [
  { label: "Instagram", value: "@seenightstudio" },
  { label: "Behance", value: "/seenightstudio" },
  { label: "X / Twitter", value: "@seenightco" },
];

export default function ContactPage() {
  return (
    <>
      <section className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink py-4 font-mono text-[10px] tracking-[0.2em] uppercase">
          <span>Contact</span>
          <span>Replies within one business night</span>
          <span className="hidden sm:inline">GMT+7</span>
        </div>
      </section>

      {/* Giant email as hero object */}
      <section className="mx-auto max-w-[1600px] px-4 py-14 md:px-8 md:py-24">
        <a
          href="mailto:hello@seenight.studio"
          className="group block leading-[0.95] font-bold tracking-tighter lowercase break-all transition-colors hover:text-accent [font-size:clamp(2.5rem,9vw,9rem)]"
        >
          hello@
          <br className="md:hidden" />
          seenight
          <span className="text-outline group-hover:[-webkit-text-stroke-color:currentColor]">
            .studio
          </span>
        </a>
      </section>

      {/* Info + form */}
      <section className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-4 pb-24 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="mb-8 border-b border-ink pb-4 font-mono text-[10px] tracking-[0.25em] uppercase">
            01 / Channels
          </h2>
          <dl className="divide-y divide-ink/15 border-b border-ink/15">
            {channels.map((c) => (
              <div key={c.label} className="py-4">
                <dt className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
                  {c.label}
                </dt>
                <dd className="mt-1">
                  <a
                    href={c.href}
                    className="text-lg font-medium underline-offset-4 hover:text-accent hover:underline"
                  >
                    {c.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>

          <dl className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
            {socials.map((s) => (
              <div
                key={s.label}
                className="flex items-baseline justify-between py-3"
              >
                <dt className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
                  {s.label}
                </dt>
                <dd className="text-sm font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-10 max-w-xs text-sm leading-relaxed text-ink/60">
            See Night Studio
            <br />
            Jl. Malam No. 13, Jakarta Selatan
            <br />
            Indonesia 12730
          </p>
        </div>

        <form
          action="mailto:hello@seenight.studio"
          method="post"
          encType="text/plain"
          className="lg:col-span-6 lg:col-start-7"
        >
          <h2 className="mb-8 border-b border-ink pb-4 font-mono text-[10px] tracking-[0.25em] uppercase">
            02 / Write to us
          </h2>

          <div className="space-y-6">
            {[
              { id: "name", label: "Your name", type: "text" },
              { id: "email", label: "Email", type: "email" },
            ].map((field) => (
              <label key={field.id} htmlFor={field.id} className="block">
                <span className="mb-2 block font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
                  {field.label}
                </span>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  required
                  className="block w-full border border-ink/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
                />
              </label>
            ))}

            <label htmlFor="message" className="block">
              <span className="mb-2 block font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
                Message
              </span>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="block w-full resize-none border border-ink/25 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
              />
            </label>

            <button
              type="submit"
              className="w-full border border-ink py-4 text-xs font-medium tracking-[0.25em] uppercase transition-colors hover:bg-ink hover:text-paper"
            >
              Send message →
            </button>

            <p className="font-mono text-[10px] leading-relaxed tracking-[0.15em] text-ink/40 uppercase">
              Static phase: this form opens your mail client. A real endpoint
              ships with phase two.
            </p>
          </div>
        </form>
      </section>
    </>
  );
}
