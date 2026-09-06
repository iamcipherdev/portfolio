"use client";

import { useCallback, useEffect, useState } from "react";

/* ── Data fetching hook for admin pages ─────── */
export function useAdminData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `Request failed (${res.status})`);
      setData((await res.json()) as T);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch, setData };
}

/* ── JSON API mutation helper ───────────────── */
export async function apiSend<T = unknown>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? `Request failed (${res.status})`);
  return json as T;
}

/* ── Unsaved-changes tracking ─────────────────
 * Call inside a form component that is freshly mounted
 * when editing starts — the snapshot is captured once. */
export function useDirtyForm(current: unknown) {
  const [snapshot] = useState<string>(() => JSON.stringify(current));
  const dirty = JSON.stringify(current) !== snapshot;

  useEffect(() => {
    if (!dirty) return;
    const onBefore = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBefore);
    return () => window.removeEventListener("beforeunload", onBefore);
  }, [dirty]);

  return dirty;
}

/* ── Slug auto-generation ───────────────────── */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ── Shared admin row types (mirror Prisma rows) ── */
export type AdminProject = {
  id: string;
  projectNumber: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  year: string;
  status: string;
  technologies: string;
  liveUrl: string;
  githubUrl: string;
  domain: string;
  coverImage: string;
  coverImageSm: string;
  imageAlt: string;
  screenshots: string; // JSON array string
  featured: boolean;
  published: boolean;
  displayOrder: number;
};

export type AdminLab = {
  id: string;
  experimentId: string;
  title: string;
  description: string;
  status: string;
  dateLabel: string;
  tags: string;
  url: string;
  githubUrl: string;
  coverVisual: string;
  techNotes: string;
  published: boolean;
  displayOrder: number;
};

export type AdminTestimonial = {
  id: string;
  clientLabel: string;
  role: string;
  organization: string;
  quote: string;
  avatar: string;
  relatedProject: string;
  dateLabel: string;
  status: string; // RECONSTRUCTED | VERIFIED
  published: boolean;
  displayOrder: number;
};

export type AdminMedia = {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  createdAt: string;
};

export type AdminProfile = {
  displayName: string;
  headline: string;
  heroDescription: string;
  availabilityStatus: string;
  location: string;
  aboutText: string;
  aboutTextSecondary: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  contactCta: string;
  skills: string; // JSON string
  updatedAt?: string;
};
