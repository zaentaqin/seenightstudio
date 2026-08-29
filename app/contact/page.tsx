import type { Metadata } from "next";
import { getPageContent } from "@/lib/data";
import { PageBar, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to See Night Studio about licenses, custom typefaces, or collaborations.",
};

export default async function ContactPage() {
  const contact = await getPageContent("contact");

  const channels = contact.channels ?? [];
  const socials = contact.socials ?? [];
  const address = contact.address ?? "";

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-4 md:px-8">
        <PageBar>
          <span>Contact</span>
          <span>Replies within one business night</span>
          <span className="hidden sm:inline">GMT+7</span>
        </PageBar>
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
          <SectionHeading className="mb-8">01 / Channels</SectionHeading>
          <dl className="divide-y divide-ink/15 border-b border-ink/15">
            {channels.map(
              (c: { label: string; value: string; href?: string }) => (
                <div key={c.label} className="py-4">
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
                    {c.label}
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={c.href ?? `mailto:${c.value}`}
                      className="text-lg font-medium underline-offset-4 hover:text-accent hover:underline"
                    >
                      {c.value}
                    </a>
                  </dd>
                </div>
              ),
            )}
          </dl>

          <dl className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
            {socials.map((s: { label: string; value: string }) => (
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

          <p className="mt-10 max-w-xs text-sm leading-relaxed text-ink/60 whitespace-pre-line">
            {address}
          </p>
        </div>

        <form
          action="mailto:hello@seenight.studio"
          method="post"
          encType="text/plain"
          className="lg:col-span-6 lg:col-start-7"
        >
          <SectionHeading className="mb-8">02 / Write to us</SectionHeading>

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
