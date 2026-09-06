"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminHeader, ErrorState, ListSkeleton, Field, inputCls, textareaCls } from "@/components/admin/bits";
import { MediaPickerField } from "@/components/admin/media-picker";
import { useAdminData, apiSend, useDirtyForm, type AdminProfile } from "@/components/admin/shared";
import { Loader2 } from "lucide-react";

type SkillsGroup = { label: string; items: { name: string; note: string }[] };

export default function AdminProfilePage() {
  const { data, loading, error, refetch } = useAdminData<{ profile: AdminProfile | null }>(
    "/api/admin/profile"
  );

  return (
    <div>
      <AdminHeader
        title="Profile"
        subtitle="Core identity content used across the hero, about section, contact area and metadata."
      />
      {loading ? (
        <ListSkeleton rows={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : data?.profile ? (
        <ProfileForm key={data.profile.updatedAt ?? "profile"} initial={data.profile} onSaved={refetch} />
      ) : (
        <ErrorState message="Profile not found." onRetry={refetch} />
      )}
    </div>
  );
}

function ProfileForm({ initial, onSaved }: { initial: AdminProfile; onSaved: () => void }) {
  const [form, setForm] = useState<AdminProfile>(() => ({ ...initial }));
  const [skillsText, setSkillsText] = useState<string>(() => {
    try {
      return JSON.stringify(JSON.parse(initial.skills || "[]"), null, 2);
    } catch {
      return initial.skills || "[]";
    }
  });
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const dirty = useDirtyForm(form);

  function set<K extends keyof AdminProfile>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    let parsed: SkillsGroup[];
    try {
      parsed = JSON.parse(skillsText) as SkillsGroup[];
      if (!Array.isArray(parsed)) throw new Error("not a list");
    } catch {
      setSkillsError("Skills must be valid JSON — a list of { label, items } groups.");
      return;
    }
    setSkillsError(null);
    setSaving(true);
    try {
      await apiSend("/api/admin/profile", "PATCH", {
        ...form,
        skills: JSON.stringify(parsed),
      });
      toast.success("Profile saved — live on the site");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      onKeyDown={(e) => {
        // Cmd/Ctrl+S saves
        if ((e.metaKey || e.ctrlKey) && e.key === "s") {
          e.preventDefault();
          if (!saving) void save();
        }
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Display name">
          <input className={inputCls} value={form.displayName} onChange={(e) => set("displayName", e.target.value)} />
        </Field>
        <Field label="Availability status" hint="shown in navbar + hero chip">
          <input className={inputCls} value={form.availabilityStatus} onChange={(e) => set("availabilityStatus", e.target.value)} />
        </Field>
        <Field label="Headline" className="sm:col-span-2" hint="hero headline">
          <input className={inputCls} value={form.headline} onChange={(e) => set("headline", e.target.value)} />
        </Field>
        <Field label="Hero description" className="sm:col-span-2">
          <textarea className={textareaCls} rows={2} value={form.heroDescription} onChange={(e) => set("heroDescription", e.target.value)} />
        </Field>
        <Field label="Location" hint="e.g. PAKISTAN">
          <input className={inputCls} value={form.location} onChange={(e) => set("location", e.target.value)} />
        </Field>
        <Field label="Contact CTA label">
          <input className={inputCls} value={form.contactCta} onChange={(e) => set("contactCta", e.target.value)} />
        </Field>
        <Field label="About text" className="sm:col-span-2" hint="first paragraph">
          <textarea className={textareaCls} rows={4} value={form.aboutText} onChange={(e) => set("aboutText", e.target.value)} />
        </Field>
        <Field label="About text (secondary)" className="sm:col-span-2" hint="second paragraph">
          <textarea className={textareaCls} rows={3} value={form.aboutTextSecondary} onChange={(e) => set("aboutTextSecondary", e.target.value)} />
        </Field>

        <Field label="Email">
          <input className={inputCls} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Resume / CV URL" hint="optional">
          <input className={inputCls} value={form.resumeUrl} onChange={(e) => set("resumeUrl", e.target.value)} placeholder="https://…" />
        </Field>
        <Field label="GitHub URL">
          <input className={inputCls} value={form.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} />
        </Field>
        <Field label="LinkedIn URL">
          <input className={inputCls} value={form.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} />
        </Field>

        <Field
          label="Skills / tech stack (JSON)"
          className="sm:col-span-2"
          hint='[{ "label": "FRONTEND", "items": [{ "name": "React", "note": "…" }] }]'
        >
          <textarea
            className={`${textareaCls} font-mono text-[12px]`}
            rows={10}
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            spellCheck={false}
          />
        </Field>
        {skillsError ? (
          <p role="alert" className="rounded-lg border border-[#c0392b33] bg-[#c0392b0d] px-3 py-2.5 text-[12.5px] text-[#c0392b] sm:col-span-2">
            {skillsError}
          </p>
        ) : null}
      </div>

      {dirty ? (
        <p className="mt-4 rounded-lg border border-[#F5B83D]/40 bg-[#F5B83D]/10 px-4 py-3 text-[12.5px] text-[#9a6c00]">
          Unsaved changes — remember to save before leaving this page.
        </p>
      ) : null}

      <div className="mt-6 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="flex h-12 items-center gap-2 rounded-full bg-[#111111] px-8 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#F5F3EE] transition-colors hover:bg-[#4D6BFF] disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : null}
          {saving ? "Saving…" : "Save profile"}
        </button>
      </div>
    </div>
  );
}
