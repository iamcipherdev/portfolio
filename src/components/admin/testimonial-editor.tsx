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
import { Field, inputCls, textareaCls, AdminBadge } from "./bits";
import { MediaPickerField } from "./media-picker";
import { useDirtyForm, type AdminTestimonial } from "./shared";

const emptyTestimonial: Omit<AdminTestimonial, "id" | "displayOrder"> = {
  clientLabel: "",
  role: "",
  organization: "",
  quote: "",
  avatar: "",
  relatedProject: "",
  dateLabel: "CLIENT WORK · 2026",
  status: "RECONSTRUCTED",
  published: true,
};

export function TestimonialEditor({
  open,
  onOpenChange,
  initial,
  onSave,
  saving,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: AdminTestimonial | null;
  onSave: (data: unknown) => Promise<void>;
  saving: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onOpenChange(false)}>
      {open ? (
        <DialogContent className="max-h-[88vh] overflow-y-auto rounded-2xl border-[#11111114] bg-[#F5F3EE] sm:max-w-xl">
          <TestimonialForm
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

function TestimonialForm({
  initial,
  onOpenChange,
  onSave,
  saving,
}: {
  initial: AdminTestimonial | null;
  onOpenChange: (v: boolean) => void;
  onSave: (data: unknown) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState(() =>
    initial ? { ...emptyTestimonial, ...initial } : { ...emptyTestimonial }
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
    if (!form.clientLabel.trim() || !form.quote.trim()) {
      window.alert("Client label and quote are required.");
      return;
    }
    await onSave(form);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="h-editorial text-xl">
          {initial ? "Edit testimonial" : "New testimonial"}
        </DialogTitle>
        <DialogDescription className="text-[12px] leading-relaxed text-[#777777]">
          Only publish feedback that is real. Mark entries{" "}
          <AdminBadge label="VERIFIED" className="mx-0.5 align-middle" /> once genuine
          client quotes replace reconstructed samples.
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Client label" hint="e.g. NONPROFIT CLIENT">
          <input
            className={inputCls}
            value={form.clientLabel}
            onChange={(e) => set("clientLabel", e.target.value.toUpperCase())}
          />
        </Field>
        <Field label="Role / category">
          <input
            className={inputCls}
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            placeholder="Organization Website"
          />
        </Field>
        <Field label="Organization" hint="optional — leave blank for anonymity">
          <input className={inputCls} value={form.organization} onChange={(e) => set("organization", e.target.value)} />
        </Field>
        <Field label="Related project" hint="optional">
          <input className={inputCls} value={form.relatedProject} onChange={(e) => set("relatedProject", e.target.value)} />
        </Field>
        <Field label="Quote" className="sm:col-span-2">
          <textarea
            className={textareaCls}
            rows={4}
            value={form.quote}
            onChange={(e) => set("quote", e.target.value)}
            placeholder="Keep it realistic and restrained — no exaggerated claims."
          />
        </Field>
        <Field label="Meta label" hint="e.g. CLIENT WORK · 2026">
          <input className={inputCls} value={form.dateLabel} onChange={(e) => set("dateLabel", e.target.value)} />
        </Field>
        <Field label="Status">
          <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="RECONSTRUCTED">RECONSTRUCTED</option>
            <option value="VERIFIED">VERIFIED</option>
          </select>
        </Field>
        <div className="sm:col-span-2">
          <MediaPickerField
            label="Avatar"
            value={form.avatar}
            onChange={(v) => set("avatar", v)}
            hint="optional — initials used otherwise"
          />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-[#11111114] bg-white px-4 py-3 sm:col-span-2">
          <div>
            <p className="text-[13px] font-medium">Published</p>
            <p className="text-[11px] text-[#999999]">Visible in the testimonials section</p>
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
          {saving ? "Saving…" : initial ? "Save changes" : "Add testimonial"}
        </button>
      </div>
    </>
  );
}
