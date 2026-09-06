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
import { MediaPickerField } from "./media-picker";
import { useDirtyForm, type AdminLab } from "./shared";

const STATUSES = ["CONCEPT", "RESEARCH", "EXPLORING", "BUILDING", "LIVE", "ARCHIVED"];

const emptyLab: Omit<AdminLab, "id" | "displayOrder"> = {
  experimentId: "",
  title: "",
  description: "",
  status: "CONCEPT",
  dateLabel: "",
  tags: "",
  url: "",
  githubUrl: "",
  coverVisual: "",
  techNotes: "",
  published: true,
};

export function LabEditor({
  open,
  onOpenChange,
  initial,
  onSave,
  saving,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: AdminLab | null;
  onSave: (data: unknown) => Promise<void>;
  saving: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onOpenChange(false)}>
      {open ? (
        <DialogContent className="max-h-[88vh] overflow-y-auto rounded-2xl border-[#11111114] bg-[#F5F3EE] sm:max-w-2xl">
          <LabForm
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

function LabForm({
  initial,
  onOpenChange,
  onSave,
  saving,
}: {
  initial: AdminLab | null;
  onOpenChange: (v: boolean) => void;
  onSave: (data: unknown) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState(() =>
    initial ? { ...emptyLab, ...initial } : { ...emptyLab }
  );

  const dirty = useDirtyForm(form);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function tryClose(next: boolean) {
    if (!next && dirty) {
      const ok = window.confirm("Discard unsaved changes?");
      if (!ok) return;
    }
    onOpenChange(next);
  }

  async function submit() {
    if (!form.title.trim() || !form.description.trim()) {
      window.alert("Title and description are required.");
      return;
    }
    await onSave(form);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="h-editorial text-xl">
          {initial ? `Edit — ${initial.experimentId}` : "New Experiment"}
        </DialogTitle>
        <DialogDescription className="text-[12px] text-[#777777]">
          The Lab shows what you are currently exploring — not finished products.
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Experiment ID" hint="LAB_001 format">
          <input
            className={inputCls}
            value={form.experimentId}
            onChange={(e) => set("experimentId", e.target.value.toUpperCase())}
            placeholder={initial ? initial.experimentId : "auto (LAB_0XX)"}
          />
        </Field>
        <Field label="Status">
          <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Title" className="sm:col-span-2">
          <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <textarea
            className={textareaCls}
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
        <Field label="Date label" hint="e.g. SEP 2026">
          <input className={inputCls} value={form.dateLabel} onChange={(e) => set("dateLabel", e.target.value)} />
        </Field>
        <Field label="Tags" hint="comma separated">
          <input
            className={inputCls}
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="AI, OCR, MOBILE"
          />
        </Field>
        <Field label="URL" hint="optional">
          <input className={inputCls} value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://…" />
        </Field>
        <Field label="GitHub URL" hint="optional">
          <input className={inputCls} value={form.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} />
        </Field>
        <Field label="Technical note" hint="revealed on hover" className="sm:col-span-2">
          <input
            className={inputCls}
            value={form.techNotes}
            onChange={(e) => set("techNotes", e.target.value)}
            placeholder="OCR → semantic index → search by meaning."
          />
        </Field>
        <div className="sm:col-span-2">
          <MediaPickerField
            label="Cover visual"
            value={form.coverVisual}
            onChange={(v) => set("coverVisual", v)}
            hint="optional"
          />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-[#11111114] bg-white px-4 py-3 sm:col-span-2">
          <div>
            <p className="text-[13px] font-medium">Published</p>
            <p className="text-[11px] text-[#999999]">Visible in The Lab section</p>
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
          {saving ? "Saving…" : initial ? "Save changes" : "Add experiment"}
        </button>
      </div>
    </>
  );
}
