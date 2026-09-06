"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AdminHeader, Field, inputCls } from "@/components/admin/bits";
import { Loader2, ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (next !== confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (next.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current, next }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not change password.");
      toast.success("Password updated");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <AdminHeader
        title="Settings"
        subtitle="Admin account security. Keep this password strong — it is the only gate to your CMS."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-[#11111114] bg-white p-6 sm:p-8 lg:col-span-3"
        >
          <h2 className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#555555]">
            Change password
          </h2>
          <Field label="Current password">
            <input
              type="password"
              autoComplete="current-password"
              className={inputCls}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
            />
          </Field>
          <Field label="New password" hint="min 8 characters">
            <input
              type="password"
              autoComplete="new-password"
              className={inputCls}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
            />
          </Field>
          <Field label="Confirm new password">
            <input
              type="password"
              autoComplete="new-password"
              className={inputCls}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </Field>
          <button
            type="submit"
            disabled={saving}
            className="flex h-12 items-center gap-2 rounded-full bg-[#111111] px-7 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#F5F3EE] transition-colors hover:bg-[#4D6BFF] disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : null}
            {saving ? "Updating…" : "Update password"}
          </button>
        </form>

        <aside className="space-y-4 rounded-2xl border border-[#11111114] bg-white p-6 sm:p-8 lg:col-span-2">
          <h2 className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#555555]">
            Security notes
          </h2>
          <ul className="space-y-3.5 text-[12.5px] leading-relaxed text-[#555555]">
            <li className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#4D6BFF]" aria-hidden />
              Sessions are signed, HttpOnly cookies that expire after 7 days.
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#4D6BFF]" aria-hidden />
              Every admin API route verifies the session server-side — nothing is trusted from the browser.
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#4D6BFF]" aria-hidden />
              Passwords are stored as salted scrypt hashes, never in plain text.
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#4D6BFF]" aria-hidden />
              Repeated failed sign-ins are rate limited for one minute.
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
