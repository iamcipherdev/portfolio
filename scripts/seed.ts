/**
 * Seed the CMS database with the portfolio's real content.
 * Idempotent — safe to re-run (upserts by unique keys).
 *
 *   bun run scripts/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";

const db = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const PROJECTS = [
  {
    projectNumber: "01",
    name: "RECUROO / ORDERLY",
    shortDescription: "WhatsApp-first digital ordering experience for cafés.",
    fullDescription:
      "A WhatsApp-first ordering flow that lets café customers reorder their usual in seconds. Built around loyalty stamps, quick menus and a checkout that lives where customers already are — no app install required.",
    technologies: "NEXT.JS, WHATSAPP, ORDERING, LOYALTY",
    liveUrl: "https://recuroo.vercel.app",
    domain: "recuroo.vercel.app",
    coverImage: "/projects/recuroo-lg.webp",
    coverImageSm: "/projects/recuroo-sm.webp",
    imageAlt: "Recuroo — digital loyalty stamp card product interface",
    year: "2026",
    category: "",
    status: "LIVE",
    featured: true,
  },
  {
    projectNumber: "02",
    name: "LATE NIGHT CORNER",
    shortDescription: "A private, interactive web experience.",
    fullDescription:
      "A private interactive web experience built for two people — real-time games, shared moments and a design language that feels warm rather than technical.",
    technologies: "INTERACTIVE, REAL-TIME, EXPERIENCE",
    liveUrl: "https://latenightcorner.space-z.ai/",
    domain: "latenightcorner.space-z.ai",
    coverImage: "/projects/latenightcorner-lg.webp",
    coverImageSm: "/projects/latenightcorner-sm.webp",
    imageAlt: "Late Night Corner — interactive couple games experience",
    year: "2026",
    category: "",
    status: "LIVE",
    featured: false,
  },
  {
    projectNumber: "03",
    name: "CAMPUSLIFT",
    shortDescription: "A campus-focused digital product experience.",
    fullDescription:
      "A campus-focused digital product exploring how students move between places — ride-sharing concepts, schedule awareness and a mobile-first interface.",
    technologies: "CAMPUS, MOBILITY, PRODUCT",
    liveUrl: "https://campuslift.netlify.app",
    domain: "campuslift.netlify.app",
    coverImage: "/projects/campuslift-lg.webp",
    coverImageSm: "/projects/campuslift-sm.webp",
    imageAlt: "CampusLift — campus ride-sharing product interface",
    year: "2026",
    category: "",
    status: "LIVE",
    featured: false,
  },
  {
    projectNumber: "04",
    name: "LETTER THAT NEVER SEND",
    shortDescription:
      "An emotional interactive writing experience for words left unsaid.",
    fullDescription:
      "An emotional interactive writing experience — a quiet, dark interface for words left unsaid, where the act of writing matters more than sending.",
    technologies: "INTERACTIVE, WRITING, EMOTIONAL",
    liveUrl: "https://letterthatneversend.netlify.app",
    domain: "letterthatneversend.netlify.app",
    coverImage: "/projects/letter-lg.webp",
    coverImageSm: "/projects/letter-sm.webp",
    imageAlt: "Letter That Never Send — dark interactive writing experience",
    year: "2025",
    category: "",
    status: "LIVE",
    featured: false,
  },
  {
    projectNumber: "05",
    name: "MEERAN PAK",
    shortDescription:
      "A distinctive digital experience built around identity and presentation.",
    fullDescription:
      "A brand website for a travel & tours company — built around identity, presentation and a visual language that instantly communicates where you could go next.",
    technologies: "TRAVEL, IDENTITY, BUSINESS",
    liveUrl: "https://meeranpak.space-z.ai/",
    domain: "meeranpak.space-z.ai",
    coverImage: "/projects/meeranpak-lg.webp",
    coverImageSm: "/projects/meeranpak-sm.webp",
    imageAlt: "Meeran Pak Travel & Tours — brand website with airplane wing visual",
    year: "2025",
    category: "",
    status: "LIVE",
    featured: false,
  },
  {
    projectNumber: "06",
    name: "QURAN GUARD",
    shortDescription:
      "A browser extension focused on safer, more intentional browsing.",
    fullDescription:
      "A browser extension focused on safer, more intentional browsing — a quiet protection layer with a focused popup interface rather than a public URL.",
    technologies: "EXTENSION, SAFETY, FOCUS",
    liveUrl: "",
    domain: "browser extension",
    coverImage: "",
    coverImageSm: "",
    imageAlt: "Quran Guard — browser extension popup interface",
    year: "2026",
    category: "",
    status: "LIVE",
    featured: false,
  },
  {
    projectNumber: "07",
    name: "RISE & RESTORE FOUNDATION",
    shortDescription:
      "A modern nonprofit digital experience designed to communicate the organization’s mission, initiatives and impact clearly.",
    fullDescription:
      "A complete digital presence for Rise & Restore Foundation — a nonprofit focused on community impact. The site communicates the organization's mission, programs and initiatives clearly, with a structure that lets supporters understand the work and get involved quickly.",
    technologies: "WEB DEVELOPMENT, UI/UX, NONPROFIT",
    liveUrl: "https://risenrestore.org",
    domain: "risenrestore.org",
    coverImage: "/projects/risenrestore-lg.webp",
    coverImageSm: "/projects/risenrestore-sm.webp",
    imageAlt:
      "Rise & Restore Foundation — nonprofit website with mission hero and program cards",
    year: "2026",
    category: "NONPROFIT · CLIENT WORK",
    status: "LIVE",
    featured: true,
  },
];

const LAB = [
  {
    experimentId: "LAB_001",
    title: "LIVE CYBER THREAT INTELLIGENCE",
    description:
      "Exploring how public threat intelligence feeds can be turned into useful, real-time security visualizations.",
    status: "EXPLORING",
    dateLabel: "SEP 2026",
    tags: "CYBERSECURITY, DATA, APIs",
    techNotes: "Public threat feeds → structured intelligence → visualization.",
  },
  {
    experimentId: "LAB_002",
    title: "CYBERSECURITY AWARENESS GAME",
    description:
      "An interactive attack-and-defend experience designed to teach cybersecurity through decisions instead of lectures.",
    status: "CONCEPT",
    dateLabel: "AUG 2026",
    tags: "SECURITY, GAME DESIGN, INTERACTIVE",
    techNotes: "Decision-driven scenarios → learn by defending, not reading.",
  },
  {
    experimentId: "LAB_003",
    title: "AI SCREENSHOT MANAGER",
    description:
      "Exploring a smarter way to organize screenshots using OCR, semantic search and AI-generated context.",
    status: "RESEARCH",
    dateLabel: "JUL 2026",
    tags: "AI, OCR, MOBILE",
    techNotes: "OCR → semantic index → search by meaning, not filename.",
  },
  {
    experimentId: "LAB_004",
    title: "AI PRODUCT EXPERIMENTS",
    description:
      "Small experiments with AI APIs, agents, automation and interfaces that may eventually turn into full products.",
    status: "BUILDING",
    dateLabel: "SINCE JUN 2026",
    tags: "AI, AGENTS, AUTOMATION",
    techNotes: "APIs → agents → automation → product candidates.",
  },
];

/* Anonymous, reconstructed summaries — never attributed to
 * identifiable people. Public section carries a disclosure. */
const TESTIMONIALS = [
  {
    clientLabel: "NONPROFIT CLIENT",
    role: "Organization Website",
    organization: "",
    quote:
      "The website came together cleanly and the final result matched what we were looking for.",
    relatedProject: "Rise & Restore Foundation",
    dateLabel: "CLIENT WORK · 2026",
    status: "RECONSTRUCTED",
  },
  {
    clientLabel: "LOCAL BUSINESS OWNER",
    role: "Business Website",
    organization: "",
    quote:
      "Our initial idea was quite simple, but the final website felt much more complete and professional.",
    relatedProject: "",
    dateLabel: "CLIENT WORK · 2025",
    status: "RECONSTRUCTED",
  },
  {
    clientLabel: "SMALL BUSINESS CLIENT",
    role: "Web Development",
    organization: "",
    quote:
      "Changes were handled quickly and communication throughout the project was straightforward.",
    relatedProject: "",
    dateLabel: "CLIENT WORK · 2025",
    status: "RECONSTRUCTED",
  },
  {
    clientLabel: "ORGANIZATION CLIENT",
    role: "Digital Presence",
    organization: "",
    quote:
      "The site worked well across mobile and desktop, and the overall experience was easy to understand.",
    relatedProject: "",
    dateLabel: "CLIENT WORK · 2025",
    status: "RECONSTRUCTED",
  },
  {
    clientLabel: "PROJECT CLIENT",
    role: "Website Development",
    organization: "",
    quote:
      "We appreciated how quickly feedback was translated into actual improvements.",
    relatedProject: "",
    dateLabel: "CLIENT WORK · 2026",
    status: "RECONSTRUCTED",
  },
  {
    clientLabel: "RETURNING CLIENT",
    role: "Digital Project",
    organization: "",
    quote:
      "The process was simple and the final product gave us a much stronger online presence.",
    relatedProject: "",
    dateLabel: "CLIENT WORK · 2026",
    status: "RECONSTRUCTED",
  },
];

const SKILLS = [
  {
    label: "FRONTEND",
    items: [
      { name: "React", note: "Interfaces that feel instant." },
      { name: "Next.js", note: "Fast, SEO-ready product foundations." },
      { name: "TypeScript", note: "Confidence at scale." },
      { name: "Tailwind CSS", note: "Design systems at speed." },
    ],
  },
  {
    label: "BACKEND",
    items: [
      { name: "Supabase", note: "Auth, data and storage, wired fast." },
      { name: "PostgreSQL", note: "Data modeled to last." },
      { name: "Node.js", note: "APIs and automation that hold up." },
    ],
  },
  {
    label: "AI",
    items: [
      { name: "OpenAI", note: "Features that understand language." },
      { name: "Gemini", note: "Multimodal capabilities in products." },
      { name: "AI APIs", note: "The right model for the job." },
      { name: "Automation", note: "Workflows that run themselves." },
    ],
  },
  {
    label: "TOOLS",
    items: [
      { name: "GitHub", note: "Versioned, reviewed, shipped." },
      { name: "Figma", note: "Where structure meets design." },
      { name: "Canva", note: "Quick brand & content visuals." },
      { name: "Vercel", note: "From commit to live in minutes." },
    ],
  },
];

async function main() {
  console.log("Seeding CMS…");

  /* Admin user + session secret */
  const existingAdmin = await db.adminUser.findUnique({ where: { username: "cipher" } });
  if (!existingAdmin) {
    await db.adminUser.create({
      data: { username: "cipher", passwordHash: hashPassword("cipher2026") },
    });
    console.log("  ✓ admin user 'cipher' created (default password cipher2026)");
  } else {
    console.log("  • admin user 'cipher' already exists");
  }

  const secret = await db.setting.findUnique({ where: { key: "session_secret" } });
  if (!secret) {
    await db.setting.create({
      data: { key: "session_secret", value: randomBytes(32).toString("hex") },
    });
    console.log("  ✓ session secret generated");
  }

  /* Profile */
  await db.profile.upsert({
    where: { id: "main" },
    update: {
      email: "iamcipher.dev@gmail.com",
      githubUrl: "https://github.com/iamcipherdev",
      linkedinUrl: "https://www.linkedin.com/in/cipherwebdev",
      skills: JSON.stringify(SKILLS),
    },
    create: {
      id: "main",
      displayName: "CIPHER",
      headline: "I build useful digital products with AI & the web.",
      heroDescription:
        "I turn ideas, problems and experiments into functional, polished digital experiences — from prototype to deployment.",
      availabilityStatus: "Available for work",
      location: "PAKISTAN",
      aboutText:
        "I’m Cipher, an AI × Web Developer focused on building modern digital products, experiments and useful tools. I enjoy taking an idea from a rough concept to something real, interactive and deployable — designing the structure, building the product and shipping it to the live web.",
      aboutTextSecondary:
        "The interesting part is rarely the code alone — it’s the translation: from a vague problem to a clear experience people can actually use.",
      email: "iamcipher.dev@gmail.com",
      githubUrl: "https://github.com/iamcipherdev",
      linkedinUrl: "https://www.linkedin.com/in/cipherwebdev",
      resumeUrl: "",
      contactCta: "Start a Conversation",
      skills: JSON.stringify(SKILLS),
    },
  });
  console.log("  ✓ profile seeded (real links wired)");

  /* Projects */
  for (const [i, p] of PROJECTS.entries()) {
    await db.project.upsert({
      where: { slug: slugify(p.name) },
      update: { ...p, displayOrder: i },
      create: { ...p, slug: slugify(p.name), displayOrder: i },
    });
  }
  console.log(`  ✓ ${PROJECTS.length} projects seeded`);

  /* Lab experiments */
  for (const [i, l] of LAB.entries()) {
    await db.labExperiment.upsert({
      where: { experimentId: l.experimentId },
      update: { ...l, displayOrder: i },
      create: { ...l, displayOrder: i },
    });
  }
  console.log(`  ✓ ${LAB.length} lab experiments seeded`);

  /* Testimonials — keyed by clientLabel+role uniqueness via upsert on
     a stable synthetic id: use clientLabel as natural key here */
  for (const [i, t] of TESTIMONIALS.entries()) {
    const existing = await db.testimonial.findFirst({
      where: { clientLabel: t.clientLabel, role: t.role },
    });
    if (existing) {
      await db.testimonial.update({
        where: { id: existing.id },
        data: { ...t, displayOrder: i },
      });
    } else {
      await db.testimonial.create({ data: { ...t, displayOrder: i } });
    }
  }
  console.log(`  ✓ ${TESTIMONIALS.length} reconstructed testimonials seeded`);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
