"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Login failed.");
      toast.success("Welcome back");
      const next = params.get("next") ?? "/admin";
      router.push(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F3EE] px-5">
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[400px]"
      >
        <div className="rounded-2xl border border-[#11111114] bg-white p-8 shadow-[0_36px_80px_-40px_rgba(17,17,17,0.3)] sm:p-10">
          <div className="mb-8">
            <p className="flex items-baseline gap-[3px] text-[19px] font-semibold tracking-[-0.02em]">
              CIPHER
              <span className="inline-block h-[7px] w-[7px] rounded-[2px] bg-[#4D6BFF]" aria-hidden />
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#777777]">
              Portfolio CMS — Admin access
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="username" className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#555555]">
                Username
              </label>
              <input
                id="username"
                autoComplete="username"
                className="h-12 w-full rounded-xl border border-[#1111111f] bg-[#F5F3EE]/60 px-4 text-[14px] outline-none transition-colors focus:border-[#4D6BFF] focus:bg-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#555555]">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="h-12 w-full rounded-xl border border-[#1111111f] bg-[#F5F3EE]/60 px-4 text-[14px] outline-none transition-colors focus:border-[#4D6BFF] focus:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error ? (
              <p role="alert" className="rounded-lg border border-[#c0392b33] bg-[#c0392b0d] px-3 py-2.5 text-[12.5px] text-[#c0392b]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#111111] font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#F5F3EE] transition-colors hover:bg-[#4D6BFF] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Lock className="h-3.5 w-3.5" aria-hidden />
              )}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[#aaaaaa]">
          Authorized access only
        </p>
      </motion.div>
    </div>
  );
}
