"use client";

import { useState, useRef } from "react";
import { Plus, X } from "lucide-react";

type PageContent = Record<string, unknown>;

interface PageEditorProps {
  slug: string;
  content: PageContent;
  action: (formData: FormData) => Promise<void>;
}

export function PageEditor({ slug, content, action }: PageEditorProps) {
  const [data, setData] = useState<PageContent>(content);
  const formRef = useRef<HTMLFormElement>(null);

  function updateField(key: string, value: unknown) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("content", JSON.stringify(data));
    action(fd);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-8">
      {slug === "home" && <HomeEditor data={data} onChange={updateField} />}
      {slug === "about" && <AboutEditor data={data} onChange={updateField} />}
      {slug === "contact" && <ContactEditor data={data} onChange={updateField} />}

      <div className="flex gap-3 pt-4 border-t border-ink/15">
        <button
          type="submit"
          className="border border-ink bg-ink px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase text-paper transition-colors hover:border-accent hover:bg-accent"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

/* ── Shared helpers ─────────────────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block font-mono text-[10px] tracking-[0.2em] text-ink/50 uppercase">
      {children}
    </label>
  );
}

function TextArea({
  value,
  onChange,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="block w-full resize-y border border-ink/25 bg-transparent px-4 py-3 text-sm leading-relaxed outline-none transition-colors focus:border-ink"
    />
  );
}

function StringList({
  value,
  onChange,
  label,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  label: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...value];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="block flex-1 border border-ink/25 bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-ink"
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="shrink-0 border border-ink/15 px-2 text-ink/30 transition-colors hover:border-red-500 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...value, ""])}
          className="flex items-center gap-1.5 border border-dashed border-ink/25 px-3 py-2 font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 transition-colors hover:border-ink/50 hover:text-ink/60"
        >
          <Plus className="h-3 w-3" /> Add {label.toLowerCase()}
        </button>
      </div>
    </div>
  );
}

function ObjectList({
  value,
  onChange,
  fields,
  label,
}: {
  value: Record<string, string>[];
  onChange: (v: Record<string, string>[]) => void;
  fields: { key: string; label: string }[];
  label: string;
}) {
  function update(index: number, key: string, val: string) {
    const next = [...value];
    next[index] = { ...next[index], [key]: val };
    onChange(next);
  }

  return (
    <div>
      <Label>{label}</Label>
      <div className="space-y-4">
        {value.map((item, i) => (
          <div key={i} className="border border-ink/15 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-ink/30">
                #{i + 1}
              </span>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="font-mono text-[9px] text-ink/30 transition-colors hover:text-red-500"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="mb-1 block font-mono text-[9px] tracking-[0.15em] text-ink/40 uppercase">
                    {f.label}
                  </label>
                  <input
                    type="text"
                    value={item[f.key] ?? ""}
                    onChange={(e) => update(i, f.key, e.target.value)}
                    className="block w-full border border-ink/25 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-ink"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...value, Object.fromEntries(fields.map((f) => [f.key, ""]))])}
          className="flex items-center gap-1.5 border border-dashed border-ink/25 px-3 py-2 font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 transition-colors hover:border-ink/50 hover:text-ink/60"
        >
          <Plus className="h-3 w-3" /> Add item
        </button>
      </div>
    </div>
  );
}

/* ── Page-specific editors ──────────────────────────────── */

function HomeEditor({
  data,
  onChange,
}: {
  data: PageContent;
  onChange: (key: string, val: unknown) => void;
}) {
  const heroBar = (data.heroBar as string[]) ?? [];
  const services = (data.services as Record<string, string>[]) ?? [];

  return (
    <>
      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-tight uppercase">Hero Bar</h2>
        <StringList
          value={heroBar}
          onChange={(v) => onChange("heroBar", v)}
          label="Scrolling items"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-tight uppercase">Tagline</h2>
        <TextArea
          value={(data.tagline as string) ?? ""}
          onChange={(v) => onChange("tagline", v)}
          rows={2}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-tight uppercase">Services</h2>
        <ObjectList
          value={services}
          onChange={(v) => onChange("services", v)}
          fields={[
            { key: "index", label: "Number" },
            { key: "title", label: "Title" },
            { key: "desc", label: "Description" },
          ]}
          label="Service"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-tight uppercase">Manifesto Teaser</h2>
        <TextArea
          value={(data.manifestoTeaser as string) ?? ""}
          onChange={(v) => onChange("manifestoTeaser", v)}
          rows={2}
        />
      </section>
    </>
  );
}

function AboutEditor({
  data,
  onChange,
}: {
  data: PageContent;
  onChange: (key: string, val: unknown) => void;
}) {
  const values = (data.values as Record<string, string>[]) ?? [];
  const team = (data.team as Record<string, string>[]) ?? [];
  const clients = (data.clients as string[]) ?? [];

  return (
    <>
      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-tight uppercase">Manifesto</h2>
        <TextArea
          value={(data.manifesto as string) ?? ""}
          onChange={(v) => onChange("manifesto", v)}
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-tight uppercase">Values</h2>
        <ObjectList
          value={values}
          onChange={(v) => onChange("values", v)}
          fields={[
            { key: "index", label: "Number" },
            { key: "title", label: "Title" },
            { key: "desc", label: "Description" },
          ]}
          label="Value"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-tight uppercase">Team</h2>
        <ObjectList
          value={team}
          onChange={(v) => onChange("team", v)}
          fields={[
            { key: "initials", label: "Initials" },
            { key: "name", label: "Name" },
            { key: "role", label: "Role" },
          ]}
          label="Member"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-tight uppercase">Clients</h2>
        <StringList
          value={clients}
          onChange={(v) => onChange("clients", v)}
          label="Client name"
        />
      </section>
    </>
  );
}

function ContactEditor({
  data,
  onChange,
}: {
  data: PageContent;
  onChange: (key: string, val: unknown) => void;
}) {
  const channels = (data.channels as Record<string, string>[]) ?? [];
  const socials = (data.socials as Record<string, string>[]) ?? [];

  return (
    <>
      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-tight uppercase">Email Channels</h2>
        <ObjectList
          value={channels}
          onChange={(v) => onChange("channels", v)}
          fields={[
            { key: "label", label: "Label" },
            { key: "value", label: "Email" },
          ]}
          label="Channel"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-tight uppercase">Socials</h2>
        <ObjectList
          value={socials}
          onChange={(v) => onChange("socials", v)}
          fields={[
            { key: "label", label: "Platform" },
            { key: "value", label: "Handle / URL" },
          ]}
          label="Social"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-tight uppercase">Address</h2>
        <TextArea
          value={(data.address as string) ?? ""}
          onChange={(v) => onChange("address", v)}
          rows={3}
        />
      </section>
    </>
  );
}
