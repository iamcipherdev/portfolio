"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Inbox, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

/* ── Section header ─────────────────────────── */
export function AdminHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="h-editorial text-2xl tracking-[-0.02em] sm:text-3xl">{title}</h1>
        {subtitle ? (
          <p className="mt-2 max-w-[64ch] text-[13px] leading-relaxed text-[#777777]">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  );
}

/* ── Status badge ───────────────────────────── */
const badgeTones: Record<string, string> = {
  LIVE: "border-[#3ECF6E]/40 bg-[#3ECF6E]/10 text-[#1d7c44]",
  BUILDING: "border-[#4D6BFF]/40 bg-[#4D6BFF]/10 text-[#4D6BFF]",
  "IN DEVELOPMENT": "border-[#F5B83D]/40 bg-[#F5B83D]/10 text-[#9a6c00]",
  EXPLORING: "border-[#4D6BFF]/40 bg-[#4D6BFF]/10 text-[#4D6BFF]",
  RESEARCH: "border-[#F5B83D]/40 bg-[#F5B83D]/10 text-[#9a6c00]",
  CONCEPT: "border-[#11111126] bg-[#11111108] text-[#777777]",
  ARCHIVED: "border-[#11111126] bg-[#11111108] text-[#999999]",
  RECONSTRUCTED: "border-[#F5B83D]/40 bg-[#F5B83D]/10 text-[#9a6c00]",
  VERIFIED: "border-[#3ECF6E]/40 bg-[#3ECF6E]/10 text-[#1d7c44]",
  DRAFT: "border-[#11111126] bg-[#11111108] text-[#999999]",
  PUBLISHED: "border-[#3ECF6E]/40 bg-[#3ECF6E]/10 text-[#1d7c44]",
};

export function AdminBadge({
  label,
  tone,
  className,
}: {
  label: string;
  tone?: keyof typeof badgeTones | string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] font-mono text-[9px] font-medium uppercase tracking-[0.16em]",
        badgeTones[tone ?? label] ?? badgeTones.CONCEPT,
        className
      )}
    >
      {label}
    </span>
  );
}

/* ── Form field wrappers ────────────────────── */
export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#555555]">
          {label}
        </span>
        {hint ? <span className="text-[10px] text-[#999999]">{hint}</span> : null}
      </label>
      {children}
    </div>
  );
}

export const inputCls =
  "h-10 w-full rounded-lg border border-[#1111111f] bg-white px-3 text-[13.5px] text-[#111111] outline-none transition-colors placeholder:text-[#aaaaaa] focus:border-[#4D6BFF] disabled:opacity-60";

export const textareaCls =
  "min-h-[96px] w-full rounded-lg border border-[#1111111f] bg-white px-3 py-2.5 text-[13.5px] leading-relaxed text-[#111111] outline-none transition-colors placeholder:text-[#aaaaaa] focus:border-[#4D6BFF] disabled:opacity-60";

/* ── Empty state ────────────────────────────── */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#11111126] bg-white/50 px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F3EE] text-[#777777]">
        <Inbox className="h-5 w-5" aria-hidden />
      </span>
      <p className="h-editorial mt-4 text-lg">{title}</p>
      <p className="mt-1.5 max-w-[44ch] text-[13px] leading-relaxed text-[#777777]">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

/* ── Error state ────────────────────────────── */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[#c0392b33] bg-[#c0392b08] px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c0392b14] text-[#c0392b]">
        <TriangleAlert className="h-5 w-5" aria-hidden />
      </span>
      <p className="h-editorial mt-4 text-lg">Something broke</p>
      <p className="mt-1.5 max-w-[44ch] text-[13px] text-[#777777]">{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-5 h-10 rounded-full bg-[#111111] px-5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#F5F3EE] transition-colors hover:bg-[#4D6BFF]"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}

/* ── Loading skeleton rows ──────────────────── */
export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-xl border border-[#11111114] bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2.5">
              <Skeleton className="h-4 w-[38%]" />
              <Skeleton className="h-3 w-[62%]" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
