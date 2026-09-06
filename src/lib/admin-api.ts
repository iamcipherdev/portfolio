import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, type SessionPayload } from "@/lib/auth";

/** Guard an admin API route — returns session or a 401 response. */
export async function guard(): Promise<
  { session: SessionPayload; res: null } | { session: null; res: NextResponse }
> {
  const session = await requireAdmin();
  if (!session) {
    return {
      session: null,
      res: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    };
  }
  return { session, res: null };
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/* ── Zod schemas ─────────────────────────────── */

export const projectSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().max(140).optional(),
  shortDescription: z.string().trim().min(1).max(300),
  fullDescription: z.string().trim().max(4000).optional().default(""),
  category: z.string().trim().max(120).optional().default(""),
  year: z.string().trim().max(20).optional().default(""),
  status: z.enum(["LIVE", "IN DEVELOPMENT", "ARCHIVED"]).optional().default("LIVE"),
  technologies: z.string().trim().max(500).optional().default(""),
  liveUrl: z.string().trim().max(500).optional().default(""),
  githubUrl: z.string().trim().max(500).optional().default(""),
  domain: z.string().trim().max(200).optional().default(""),
  coverImage: z.string().trim().max(500).optional().default(""),
  coverImageSm: z.string().trim().max(500).optional().default(""),
  imageAlt: z.string().trim().max(300).optional().default(""),
  screenshots: z.array(z.string().max(500)).max(20).optional().default([]),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
  projectNumber: z.string().trim().max(10).optional().default(""),
});

/* PATCH schema — all keys optional WITHOUT defaults so unspecified
   fields are never overwritten. */
export const projectUpdateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  slug: z.string().trim().max(140).optional(),
  shortDescription: z.string().trim().min(1).max(300).optional(),
  fullDescription: z.string().trim().max(4000).optional(),
  category: z.string().trim().max(120).optional(),
  year: z.string().trim().max(20).optional(),
  status: z.enum(["LIVE", "IN DEVELOPMENT", "ARCHIVED"]).optional(),
  technologies: z.string().trim().max(500).optional(),
  liveUrl: z.string().trim().max(500).optional(),
  githubUrl: z.string().trim().max(500).optional(),
  domain: z.string().trim().max(200).optional(),
  coverImage: z.string().trim().max(500).optional(),
  coverImageSm: z.string().trim().max(500).optional(),
  imageAlt: z.string().trim().max(300).optional(),
  screenshots: z.array(z.string().max(500)).max(20).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  projectNumber: z.string().trim().max(10).optional(),
});

export const labSchema = z.object({
  experimentId: z
    .string()
    .trim()
    .regex(/^LAB_\d{3}$/, "Use the LAB_001 format")
    .optional(),
  title: z.string().trim().min(1).max(140),
  description: z.string().trim().min(1).max(500),
  status: z
    .enum(["CONCEPT", "RESEARCH", "EXPLORING", "BUILDING", "LIVE", "ARCHIVED"])
    .optional()
    .default("CONCEPT"),
  dateLabel: z.string().trim().max(40).optional().default(""),
  tags: z.string().trim().max(300).optional().default(""),
  url: z.string().trim().max(500).optional().default(""),
  githubUrl: z.string().trim().max(500).optional().default(""),
  coverVisual: z.string().trim().max(500).optional().default(""),
  techNotes: z.string().trim().max(300).optional().default(""),
  published: z.boolean().optional().default(true),
});

export const labUpdateSchema = z.object({
  experimentId: z.string().trim().regex(/^LAB_\d{3}$/, "Use the LAB_001 format").optional(),
  title: z.string().trim().min(1).max(140).optional(),
  description: z.string().trim().min(1).max(500).optional(),
  status: z.enum(["CONCEPT", "RESEARCH", "EXPLORING", "BUILDING", "LIVE", "ARCHIVED"]).optional(),
  dateLabel: z.string().trim().max(40).optional(),
  tags: z.string().trim().max(300).optional(),
  url: z.string().trim().max(500).optional(),
  githubUrl: z.string().trim().max(500).optional(),
  coverVisual: z.string().trim().max(500).optional(),
  techNotes: z.string().trim().max(300).optional(),
  published: z.boolean().optional(),
});

export const testimonialSchema = z.object({
  clientLabel: z.string().trim().min(1).max(120),
  role: z.string().trim().max(160).optional().default(""),
  organization: z.string().trim().max(160).optional().default(""),
  quote: z.string().trim().min(1).max(800),
  avatar: z.string().trim().max(500).optional().default(""),
  relatedProject: z.string().trim().max(160).optional().default(""),
  dateLabel: z.string().trim().max(60).optional().default(""),
  status: z.enum(["RECONSTRUCTED", "VERIFIED"]).optional().default("RECONSTRUCTED"),
  published: z.boolean().optional().default(true),
});

export const testimonialUpdateSchema = z.object({
  clientLabel: z.string().trim().min(1).max(120).optional(),
  role: z.string().trim().max(160).optional(),
  organization: z.string().trim().max(160).optional(),
  quote: z.string().trim().min(1).max(800).optional(),
  avatar: z.string().trim().max(500).optional(),
  relatedProject: z.string().trim().max(160).optional(),
  dateLabel: z.string().trim().max(60).optional(),
  status: z.enum(["RECONSTRUCTED", "VERIFIED"]).optional(),
  published: z.boolean().optional(),
});

export const reorderSchema = z.object({
  ids: z.array(z.string()).min(1).max(200),
});

export const profileSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  headline: z.string().trim().min(1).max(200),
  heroDescription: z.string().trim().max(400),
  availabilityStatus: z.string().trim().max(80),
  location: z.string().trim().max(80),
  aboutText: z.string().trim().max(2000),
  aboutTextSecondary: z.string().trim().max(2000),
  email: z.string().trim().max(160),
  githubUrl: z.string().trim().max(300),
  linkedinUrl: z.string().trim().max(300),
  resumeUrl: z.string().trim().max(300),
  contactCta: z.string().trim().max(80),
  skills: z.string().max(8000), // JSON string, parsed client-side
});

export const passwordSchema = z.object({
  current: z.string().min(1),
  next: z.string().min(8, "New password must be at least 8 characters.").max(200),
});
