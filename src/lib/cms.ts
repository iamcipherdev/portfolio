import { cache } from "react";
import { db } from "@/lib/db";
import {
  projects as fallbackProjects,
  labEntries as fallbackLab,
  testimonials as fallbackTestimonials,
  fallbackProfile,
  type Project,
  type LabEntry,
  type LabTone,
  type Testimonial,
  type SiteProfile,
} from "@/lib/site";

/* ─────────────────────────────────────────────
 * CMS data layer — the ONLY source of public content.
 * Server components call getPublicData(); admin API
 * routes mutate the same tables. If the DB is empty
 * or unreachable we degrade gracefully to the static
 * fallbacks in site.ts (site never breaks).
 * ───────────────────────────────────────────── */

const LAB_STATUS_TONE: Record<string, LabTone> = {
  CONCEPT: "concept",
  RESEARCH: "research",
  EXPLORING: "exploring",
  BUILDING: "building",
  LIVE: "live",
  ARCHIVED: "archived",
  // legacy value support
  ONGOING: "building",
};

export function labToneOf(status: string): LabTone {
  return LAB_STATUS_TONE[status.toUpperCase()] ?? "concept";
}

function splitTags(csv: string): string[] {
  return csv
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function mapProject(row: {
  projectNumber: string;
  name: string;
  shortDescription: string;
  technologies: string;
  liveUrl: string;
  domain: string;
  coverImage: string;
  coverImageSm: string;
  imageAlt: string;
  year: string;
  category: string;
  mockup: boolean;
}): Project {
  const hasImage = !!row.coverImage;
  return {
    index: row.projectNumber,
    name: row.name,
    description: row.shortDescription,
    tags: splitTags(row.technologies),
    url: row.liveUrl,
    domain: row.domain || (row.liveUrl ? safeHost(row.liveUrl) : ""),
    image: hasImage
      ? {
          lg: row.coverImage,
          sm: row.coverImageSm || row.coverImage,
          alt: row.imageAlt || `${row.name} — project interface`,
        }
      : undefined,
    mockup: row.mockup && !hasImage ? "extension" : undefined,
    year: row.year,
    category: row.category || undefined,
    cta: row.category ? "VIEW LIVE PROJECT" : undefined,
  };
}

function safeHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

export const getPublicData = cache(async () => {
  try {
    const [projectRows, labRows, testimonialRows, profileRow] = await Promise.all([
      db.project.findMany({
        where: { published: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      }),
      db.labExperiment.findMany({
        where: { published: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      }),
      db.testimonial.findMany({
        where: { published: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      }),
      db.profile.findUnique({ where: { id: "main" } }),
    ]);

    const mappedProjects: Project[] = projectRows.map((p) =>
      mapProject({ ...p, mockup: p.name.toUpperCase().includes("QURAN GUARD") })
    );

    const mappedLab: LabEntry[] = labRows.map((l) => ({
      id: l.experimentId,
      name: l.title,
      status: l.status,
      tone: labToneOf(l.status),
      date: l.dateLabel,
      note: l.description,
      techNote: l.techNotes,
      tags: splitTags(l.tags),
    }));

    const mappedTestimonials: Testimonial[] = testimonialRows.map((t) => ({
      quote: t.quote,
      clientLabel: t.clientLabel,
      role: t.role || t.organization,
      meta: t.dateLabel || "CLIENT WORK · 2026",
      status: t.status === "VERIFIED" ? "VERIFIED" : "RECONSTRUCTED",
      avatar: t.avatar || undefined,
    }));

    const profile: SiteProfile = profileRow
      ? {
          displayName: profileRow.displayName,
          headline: profileRow.headline,
          heroDescription: profileRow.heroDescription,
          availabilityStatus: profileRow.availabilityStatus,
          location: profileRow.location,
          aboutText: profileRow.aboutText,
          aboutTextSecondary: profileRow.aboutTextSecondary,
          email: profileRow.email,
          githubUrl: profileRow.githubUrl,
          linkedinUrl: profileRow.linkedinUrl,
          resumeUrl: profileRow.resumeUrl,
          contactCta: profileRow.contactCta,
          skills: safeParseSkills(profileRow.skills),
        }
      : fallbackProfile;

    return {
      projects: mappedProjects.length ? mappedProjects : fallbackProjects,
      lab: mappedLab.length ? mappedLab : fallbackLab,
      testimonials: mappedTestimonials.length ? mappedTestimonials : fallbackTestimonials,
      profile,
      source: "db" as const,
    };
  } catch (error) {
    console.error("[cms] falling back to static content:", error);
    return {
      projects: fallbackProjects,
      lab: fallbackLab,
      testimonials: fallbackTestimonials,
      profile: fallbackProfile,
      source: "fallback" as const,
    };
  }
});

function safeParseSkills(json: string) {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    /* ignore */
  }
  return fallbackProfile.skills;
}

/* ── Admin overview stats ───────────────────── */
export async function getAdminStats() {
  const [publishedProjects, totalProjects, publishedLab, totalLab, publishedTestimonials, totalTestimonials, draftProjects, draftLab, draftTestimonials] =
    await Promise.all([
      db.project.count({ where: { published: true } }),
      db.project.count(),
      db.labExperiment.count({ where: { published: true } }),
      db.labExperiment.count(),
      db.testimonial.count({ where: { published: true } }),
      db.testimonial.count(),
      db.project.count({ where: { published: false } }),
      db.labExperiment.count({ where: { published: false } }),
      db.testimonial.count({ where: { published: false } }),
    ]);

  return {
    publishedProjects,
    totalProjects,
    publishedLab,
    totalLab,
    publishedTestimonials,
    totalTestimonials,
    drafts: draftProjects + draftLab + draftTestimonials,
  };
}
