"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Field, inputCls, textareaCls } from "./bits";
import { MediaPickerField, MediaLibraryDialog } from "./media-picker";
import { useDirtyForm, slugify, type AdminProject } from "./shared";
import { Plus, X } from "lucide-react";

const emptyProject: Omit<AdminProject, "id" | "displayOrder"> = {
  projectNumber: "",
  name: "",
  slug: "",
  shortDescription: "",
  fullDescription: "",
  category: "",
  year: "2026",
  status: "LIVE",
  technologies: "",
  liveUrl: "",
  githubUrl: "",
  domain: "",
  coverImage: "",
  coverImageSm: "",
  imageAlt: "",
  screenshots: "[]",
  featured: false,
  published: true,
};

export function ProjectEditor({
  open,
  onOpenChange,
  initial,
  onSave,
  saving,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: AdminProject | null; // null = create
  onSave: (data: unknown) => Promise<void>;
  saving: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onOpenChange(false)}>
      {open ? (
        <DialogContent className="max-h-[88vh] overflow-y-auto rounded-2xl border-[#11111114] bg-[#F5F3EE] sm:max-w-2xl">
          <ProjectForm
            initial={initial}
            onOpenChange={onOpenChange}
            onSave={onSave}
            saving={saving}
          />
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

function ProjectForm({
  initial,
  onOpenChange,
  onSave,
  saving,
}: {
  initial: AdminProject | null;
  onOpenChange: (v: boolean) => void;
  onSave: (data: unknown) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState(() =>
    initial ? { ...emptyProject, ...initial } : { ...emptyProject }
  );
  const [slugLocked, setSlugLocked] = useState(() => !initial);
  const [shotsOpen, setShotsOpen] = useState(false);

  const dirty = useDirtyForm(form);

  const screenshots: string[] = (() => {
    try {
      const parsed = JSON.parse(form.screenshots);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "name" && slugLocked) next.slug = slugify(String(value));
      return next;
    });
  }

  async function tryClose(next: boolean) {
    if (!next && dirty) {
      const ok = window.confirm("Discard unsaved changes?");
      if (!ok) return;
    }
    onOpenChange(next);
  }

  async function submit() {
    if (!form.name.trim() || !form.shortDescription.trim()) {
      window.alert("Name and short description are required.");
      return;
    }
    let screenshots: string[] = [];
    try {
      const parsed = JSON.parse(form.screenshots);
      if (Array.isArray(parsed)) screenshots = parsed;
    } catch {
      screenshots = [];
    }
    await onSave({
      ...form,
      slug: form.slug || slugify(form.name),
      screenshots,
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="h-editorial text-xl">
          {initial ? `Edit — ${initial.name}` : "New Project"}
        </DialogTitle>
        <DialogDescription className="text-[12px] text-[#777777]">
          Changes appear on the public portfolio immediately after saving.
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Project name">
          <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Slug" hint="auto from name">
          <input
            className={inputCls}
            value={form.slug}
            onChange={(e) => {
              setSlugLocked(false);
              set("slug", e.target.value);
            }}
          />
        </Field>
        <Field label="Short description" className="sm:col-span-2">
          <textarea
            className={textareaCls}
            value={form.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
            rows={2}
          />
        </Field>
        <Field label="Full description" hint="optional" className="sm:col-span-2">
          <textarea
            className={textareaCls}
            value={form.fullDescription}
            onChange={(e) => set("fullDescription", e.target.value)}
            rows={4}
          />
        </Field>
        <Field label="Category" hint="e.g. NONPROFIT · CLIENT WORK">
          <input className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)} />
        </Field>
        <Field label="Year">
          <input className={inputCls} value={form.year} onChange={(e) => set("year", e.target.value)} />
        </Field>
        <Field label="Project status">
          <select
            className={inputCls}
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="LIVE">LIVE</option>
            <option value="IN DEVELOPMENT">IN DEVELOPMENT</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </Field>
        <Field label="Project number" hint="e.g. 01">
          <input
            className={inputCls}
            value={form.projectNumber}
            onChange={(e) => set("projectNumber", e.target.value)}
          />
        </Field>
        <Field label="Technologies / tags" hint="comma separated" className="sm:col-span-2">
          <input
            className={inputCls}
            value={form.technologies}
            onChange={(e) => set("technologies", e.target.value)}
            placeholder="WEB DEVELOPMENT, UI/UX, NONPROFIT"
          />
        </Field>
        <Field label="Live URL">
          <input className={inputCls} value={form.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} placeholder="https://…" />
        </Field>
        <Field label="GitHub URL">
          <input className={inputCls} value={form.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} placeholder="https://github.com/…" />
        </Field>
        <Field label="Browser-frame label" hint="shown on the card frame">
          <input className={inputCls} value={form.domain} onChange={(e) => set("domain", e.target.value)} />
        </Field>
        <Field label="Image alt text">
          <input className={inputCls} value={form.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} />
        </Field>
        <MediaPickerField
          label="Cover image (large)"
          value={form.coverImage}
          onChange={(v) => set("coverImage", v)}
        />
        <MediaPickerField
          label="Cover image (small)"
          value={form.coverImageSm}
          onChange={(v) => set("coverImageSm", v)}
          hint="optional"
        />

        {/* Screenshots */}
        <div className="space-y-1.5 sm:col-span-2">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#555555]">
            Additional screenshots
          </span>
          <div className="flex flex-wrap gap-2">
            {screenshots.map((url) => (
              <div key={url} className="group relative">
                <img src={url} alt="Screenshot" className="h-16 w-24 rounded-md border border-[#11111114] object-cover" />
                <button
                  type="button"
                  onClick={() => set("screenshots", JSON.stringify(screenshots.filter((s) => s !== url)))}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#111111] text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove screenshot"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setShotsOpen(true)}
              className="flex h-16 w-24 items-center justify-center rounded-md border border-dashed border-[#1111113d] text-[#777777] transition-colors hover:border-[#4D6BFF] hover:text-[#4D6BFF]"
              aria-label="Add screenshot from library"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <MediaLibraryDialog
            open={shotsOpen}
            onOpenChange={setShotsOpen}
            onSelect={(url) => {
              if (!screenshots.includes(url)) {
                set("screenshots", JSON.stringify([...screenshots, url]));
              }
            }}
          />
        </div>

        {/* Toggles */}
        <div className="flex items-center justify-between rounded-xl border border-[#11111114] bg-white px-4 py-3">
          <div>
            <p className="text-[13px] font-medium">Featured</p>
            <p className="text-[11px] text-[#999999]">Highlight this project</p>
          </div>
          <Switch checked={form.featured} onCheckedChange={(v) => set("featured", v)} />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-[#11111114] bg-white px-4 py-3">
          <div>
            <p className="text-[13px] font-medium">Published</p>
            <p className="text-[11px] text-[#999999]">Visible on the public site</p>
          </div>
          <Switch checked={form.published} onCheckedChange={(v) => set("published", v)} />
        </div>
      </div>

      <div className="sticky bottom-0 -mx-2 mt-2 flex justify-end gap-3 border-t border-[#11111114] bg-[#F5F3EE] px-2 pb-1 pt-4">
        <button
          type="button"
          onClick={() => tryClose(false)}
          className="h-11 rounded-full border border-[#11111126] px-6 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#555555] transition-colors hover:border-[#111111]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="h-11 rounded-full bg-[#111111] px-7 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#F5F3EE] transition-colors hover:bg-[#4D6BFF] disabled:opacity-60"
        >
          {saving ? "Saving…" : initial ? "Save changes" : "Create project"}
        </button>
      </div>
    </>
  );
}
