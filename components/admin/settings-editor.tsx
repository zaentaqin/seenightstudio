"use client";

import { useState } from "react";
import { Plus, X, ChevronDown, ChevronRight } from "lucide-react";

type SettingsValue = Record<string, unknown>;

interface SettingsEditorProps {
  settingKey: string;
  value: SettingsValue;
  action: (formData: FormData) => Promise<void>;
}

export function SettingsEditor({ settingKey, value, action }: SettingsEditorProps) {
  const [data, setData] = useState<SettingsValue>(value);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function updateField(key: string, val: unknown) {
    setData((prev) => ({ ...prev, [key]: val }));
  }

  function toggle(key: string) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("value", JSON.stringify(data));
    action(fd);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      {settingKey === "nav" && <NavEditor data={data} onChange={updateField} />}
      {settingKey === "footer" && (
        <FooterEditor
          data={data}
          onChange={updateField}
          expanded={expanded}
          toggle={toggle}
        />
      )}

      <div className="flex justify-end pt-4 border-t border-ink/15">
        <button
          type="submit"
          className="border border-ink bg-ink px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase text-paper transition-colors hover:border-accent hover:bg-accent"
        >
          Save
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

function LinkList({
  value,
  onChange,
  label,
}: {
  value: { label: string; href: string }[];
  onChange: (v: { label: string; href: string }[]) => void;
  label: string;
}) {
  function update(index: number, key: "label" | "href", val: string) {
    const next = [...value];
    next[index] = { ...next[index], [key]: val };
    onChange(next);
  }

  return (
    <div>
      <Label>{label}</Label>
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item.label}
              onChange={(e) => update(i, "label", e.target.value)}
              placeholder="Label"
              className="block w-1/2 border border-ink/25 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:border-ink"
            />
            <input
              type="text"
              value={item.href}
              onChange={(e) => update(i, "href", e.target.value)}
              placeholder="URL"
              className="block flex-1 border border-ink/25 bg-transparent px-3 py-2.5 font-mono text-sm outline-none transition-colors focus:border-ink"
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
          onClick={() => onChange([...value, { label: "", href: "" }])}
          className="flex items-center gap-1.5 border border-dashed border-ink/25 px-3 py-2 font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 transition-colors hover:border-ink/50 hover:text-ink/60"
        >
          <Plus className="h-3 w-3" /> Add link
        </button>
      </div>
    </div>
  );
}

/* ── Nav editor ─────────────────────────────────────────── */

function NavEditor({
  data,
  onChange,
}: {
  data: SettingsValue;
  onChange: (key: string, val: unknown) => void;
}) {
  const links = (data.links as { label: string; href: string }[]) ?? [];

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-bold tracking-tight uppercase">Navigation Links</h2>
      <LinkList value={links} onChange={(v) => onChange("links", v)} label="Links" />
    </section>
  );
}

/* ── Footer editor ──────────────────────────────────────── */

function FooterEditor({
  data,
  onChange,
  expanded,
  toggle,
}: {
  data: SettingsValue;
  onChange: (key: string, val: unknown) => void;
  expanded: Record<string, boolean>;
  toggle: (key: string) => void;
}) {
  const columns = (data.columns as { title: string; links: { label: string; href: string }[] }[]) ?? [];

  function updateColumn(index: number, key: string, val: unknown) {
    const next = [...columns];
    next[index] = { ...next[index], [key]: val };
    onChange("columns", next);
  }

  function updateColumnLinks(colIndex: number, links: { label: string; href: string }[]) {
    updateColumn(colIndex, "links", links);
  }

  return (
    <div className="space-y-6">
      {/* Footer columns */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-tight uppercase">Footer Columns</h2>
        <div className="space-y-3">
          {columns.map((col, i) => (
            <div key={i} className="border border-ink/15">
              <button
                type="button"
                onClick={() => toggle(`col-${i}`)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-ink/5"
              >
                <div className="flex items-center gap-2">
                  {expanded[`col-${i}`] ? (
                    <ChevronDown className="h-3.5 w-3.5 text-ink/40" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-ink/40" />
                  )}
                  <span className="text-sm font-medium">
                    {col.title || `Column ${i + 1}`}
                  </span>
                  <span className="font-mono text-[9px] text-ink/30">
                    ({col.links?.length ?? 0} links)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange("columns", columns.filter((_, j) => j !== i));
                  }}
                  className="font-mono text-[9px] text-ink/30 transition-colors hover:text-red-500"
                >
                  Remove
                </button>
              </button>

              {expanded[`col-${i}`] && (
                <div className="border-t border-ink/10 px-4 py-4 space-y-4">
                  <div>
                    <Label>Column title</Label>
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) => updateColumn(i, "title", e.target.value)}
                      className="block w-full border border-ink/25 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:border-ink"
                    />
                  </div>
                  <LinkList
                    value={col.links ?? []}
                    onChange={(v) => updateColumnLinks(i, v)}
                    label="Links"
                  />
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange("columns", [...columns, { title: "", links: [] }])
            }
            className="flex items-center gap-1.5 border border-dashed border-ink/25 px-3 py-2 font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 transition-colors hover:border-ink/50 hover:text-ink/60"
          >
            <Plus className="h-3 w-3" /> Add column
          </button>
        </div>
      </section>

      {/* Footer text fields */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold tracking-tight uppercase">Footer Text</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Copyright</Label>
            <input
              type="text"
              value={(data.copyright as string) ?? ""}
              onChange={(e) => onChange("copyright", e.target.value)}
              className="block w-full border border-ink/25 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:border-ink"
            />
          </div>
          <div>
            <Label>Location</Label>
            <input
              type="text"
              value={(data.location as string) ?? ""}
              onChange={(e) => onChange("location", e.target.value)}
              className="block w-full border border-ink/25 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:border-ink"
            />
          </div>
        </div>
        <div>
          <Label>Notice</Label>
          <input
            type="text"
            value={(data.notice as string) ?? ""}
            onChange={(e) => onChange("notice", e.target.value)}
            className="block w-full border border-ink/25 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:border-ink"
          />
        </div>
        <div>
          <Label>Newsletter description</Label>
          <textarea
            value={(data.newsletter as string) ?? ""}
            onChange={(e) => onChange("newsletter", e.target.value)}
            rows={2}
            className="block w-full resize-y border border-ink/25 bg-transparent px-3 py-2.5 text-sm leading-relaxed outline-none transition-colors focus:border-ink"
          />
        </div>
      </section>
    </div>
  );
}
