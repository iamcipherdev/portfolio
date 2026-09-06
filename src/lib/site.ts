/* ─────────────────────────────────────────────
 * Static site constants + typed shapes.
 * Content (projects / lab / testimonials / profile)
 * is served from the CMS database via src/lib/cms.ts —
 * the arrays below act ONLY as resilience fallbacks.
 * ───────────────────────────────────────────── */

export const site = {
  name: "CIPHER",
  role: "AI × WEB DEVELOPER",
  statement: "I build useful digital products with AI & the web.",
  basedIn: "PAKISTAN",
  year: "2026",
  email: "mailto:iamcipher.dev@gmail.com",
  emailAddress: "iamcipher.dev@gmail.com",
  github: "https://github.com/iamcipherdev",
  linkedin: "https://www.linkedin.com/in/cipherwebdev",
};

export const navItems = [
  { id: "work", label: "WORK" },
  { id: "about", label: "ABOUT" },
  { id: "lab", label: "LAB" },
  { id: "contact", label: "CONTACT" },
] as const;

export type Project = {
  index: string;
  name: string;
  description: string;
  tags: string[];
  url: string;
  domain: string;
  image?: { lg: string; sm: string; alt: string };
  mockup?: "extension";
  year: string;
  /* Client / real-world work treatment */
  category?: string;
  cta?: string;
};

export const projects: Project[] = [
  {
    index: "01",
    name: "RECUROO / ORDERLY",
    description: "WhatsApp-first digital ordering experience for cafés.",
    tags: ["WHATSAPP", "ORDERING", "LOYALTY"],
    url: "https://recuroo.vercel.app",
    domain: "recuroo.vercel.app",
    image: {
      lg: "/projects/recuroo-lg.webp",
      sm: "/projects/recuroo-sm.webp",
      alt: "Recuroo — digital loyalty stamp card product interface",
    },
    year: "2026",
  },
  {
    index: "02",
    name: "LATE NIGHT CORNER",
    description: "A private, interactive web experience.",
    tags: ["INTERACTIVE", "REAL-TIME", "EXPERIENCE"],
    url: "https://latenightcorner.space-z.ai/",
    domain: "latenightcorner.space-z.ai",
    image: {
      lg: "/projects/latenightcorner-lg.webp",
      sm: "/projects/latenightcorner-sm.webp",
      alt: "Late Night Corner — interactive couple games experience",
    },
    year: "2026",
  },
  {
    index: "03",
    name: "CAMPUSLIFT",
    description: "A campus-focused digital product experience.",
    tags: ["CAMPUS", "MOBILITY", "PRODUCT"],
    url: "https://campuslift.netlify.app",
    domain: "campuslift.netlify.app",
    image: {
      lg: "/projects/campuslift-lg.webp",
      sm: "/projects/campuslift-sm.webp",
      alt: "CampusLift — campus ride-sharing product interface",
    },
    year: "2026",
  },
  {
    index: "04",
    name: "LETTER THAT NEVER SEND",
    description:
      "An emotional interactive writing experience for words left unsaid.",
    tags: ["INTERACTIVE", "WRITING", "EMOTIONAL"],
    url: "https://letterthatneversend.netlify.app",
    domain: "letterthatneversend.netlify.app",
    image: {
      lg: "/projects/letter-lg.webp",
      sm: "/projects/letter-sm.webp",
      alt: "Letter That Never Send — dark interactive writing experience",
    },
    year: "2025",
  },
  {
    index: "05",
    name: "MEERAN PAK",
    description:
      "A distinctive digital experience built around identity and presentation.",
    tags: ["TRAVEL", "IDENTITY", "BUSINESS"],
    url: "https://meeranpak.space-z.ai/",
    domain: "meeranpak.space-z.ai",
    image: {
      lg: "/projects/meeranpak-lg.webp",
      sm: "/projects/meeranpak-sm.webp",
      alt: "Meeran Pak Travel & Tours — brand website with airplane wing visual",
    },
    year: "2025",
  },
  {
    index: "06",
    name: "QURAN GUARD",
    description: "A browser extension focused on safer, more intentional browsing.",
    tags: ["EXTENSION", "SAFETY", "FOCUS"],
    url: "",
    domain: "browser extension",
    mockup: "extension",
    year: "2026",
  },
  {
    index: "07",
    name: "RISE & RESTORE FOUNDATION",
    description:
      "A modern nonprofit digital experience designed to communicate the organization’s mission, initiatives and impact clearly.",
    tags: ["WEB DEVELOPMENT", "UI/UX", "NONPROFIT"],
    url: "https://risenrestore.org",
    domain: "risenrestore.org",
    image: {
      lg: "/projects/risenrestore-lg.webp",
      sm: "/projects/risenrestore-sm.webp",
      alt: "Rise & Restore Foundation — nonprofit website with mission hero and program cards",
    },
    category: "NONPROFIT · CLIENT WORK",
    cta: "VIEW LIVE PROJECT",
    year: "2026",
  },
];

export type LabTone =
  | "exploring"
  | "concept"
  | "research"
  | "building"
  | "live"
  | "archived";

export type LabEntry = {
  id: string; // LAB_001
  name: string;
  status: string;
  tone: LabTone;
  date: string;
  note: string;
  techNote: string; // revealed on hover (always visible on touch)
  tags: string[];
};

export const labEntries: LabEntry[] = [
  {
    id: "LAB_001",
    name: "LIVE CYBER THREAT INTELLIGENCE",
    status: "EXPLORING",
    tone: "exploring",
    date: "SEP 2026",
    note:
      "Exploring how public threat intelligence feeds can be turned into useful, real-time security visualizations.",
    techNote: "Public threat feeds → structured intelligence → visualization.",
    tags: ["CYBERSECURITY", "DATA", "APIs"],
  },
  {
    id: "LAB_002",
    name: "CYBERSECURITY AWARENESS GAME",
    status: "CONCEPT",
    tone: "concept",
    date: "AUG 2026",
    note:
      "An interactive attack-and-defend experience designed to teach cybersecurity through decisions instead of lectures.",
    techNote: "Decision-driven scenarios → learn by defending, not reading.",
    tags: ["SECURITY", "GAME DESIGN", "INTERACTIVE"],
  },
  {
    id: "LAB_003",
    name: "AI SCREENSHOT MANAGER",
    status: "RESEARCH",
    tone: "research",
    date: "JUL 2026",
    note:
      "Exploring a smarter way to organize screenshots using OCR, semantic search and AI-generated context.",
    techNote: "OCR → semantic index → search by meaning, not filename.",
    tags: ["AI", "OCR", "MOBILE"],
  },
  {
    id: "LAB_004",
    name: "AI PRODUCT EXPERIMENTS",
    status: "BUILDING",
    tone: "building",
    date: "SINCE JUN 2026",
    note:
      "Small experiments with AI APIs, agents, automation and interfaces that may eventually turn into full products.",
    techNote: "APIs → agents → automation → product candidates.",
    tags: ["AI", "AGENTS", "AUTOMATION"],
  },
];

/* ── Testimonials ─────────────────────────────
 * POLICY: the seeded cards are anonymous, reconstructed
 * summaries — never attributed to identifiable people.
 * The public section carries a visible
 * "CLIENT FEEDBACK — RECONSTRUCTED" disclosure.
 * Replace them with genuine client quotes via /admin
 * and mark them VERIFIED.
 */
export type Testimonial = {
  quote: string;
  clientLabel: string;
  role: string;
  meta: string;
  status: "RECONSTRUCTED" | "VERIFIED";
  avatar?: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "The website came together cleanly and the final result matched what we were looking for.",
    clientLabel: "NONPROFIT CLIENT",
    role: "Organization Website",
    meta: "CLIENT WORK · 2026",
    status: "RECONSTRUCTED",
  },
  {
    quote:
      "Our initial idea was quite simple, but the final website felt much more complete and professional.",
    clientLabel: "LOCAL BUSINESS OWNER",
    role: "Business Website",
    meta: "CLIENT WORK · 2025",
    status: "RECONSTRUCTED",
  },
  {
    quote:
      "Changes were handled quickly and communication throughout the project was straightforward.",
    clientLabel: "SMALL BUSINESS CLIENT",
    role: "Web Development",
    meta: "CLIENT WORK · 2025",
    status: "RECONSTRUCTED",
  },
  {
    quote:
      "The site worked well across mobile and desktop, and the overall experience was easy to understand.",
    clientLabel: "ORGANIZATION CLIENT",
    role: "Digital Presence",
    meta: "CLIENT WORK · 2025",
    status: "RECONSTRUCTED",
  },
  {
    quote:
      "We appreciated how quickly feedback was translated into actual improvements.",
    clientLabel: "PROJECT CLIENT",
    role: "Website Development",
    meta: "CLIENT WORK · 2026",
    status: "RECONSTRUCTED",
  },
  {
    quote:
      "The process was simple and the final product gave us a much stronger online presence.",
    clientLabel: "RETURNING CLIENT",
    role: "Digital Project",
    meta: "CLIENT WORK · 2026",
    status: "RECONSTRUCTED",
  },
];

export type StackGroup = {
  label: string;
  items: { name: string; note: string }[];
};

export const stackGroups: StackGroup[] = [
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

export const capabilities = [
  {
    index: "01",
    title: "AI PRODUCTS",
    description:
      "AI-powered features, automation and intelligent workflows — designed to be genuinely useful, not decorative.",
  },
  {
    index: "02",
    title: "WEB DEVELOPMENT",
    description:
      "Modern responsive applications and polished interfaces that hold up on every screen.",
  },
  {
    index: "03",
    title: "RAPID PROTOTYPING",
    description:
      "Turning concepts into working products quickly — so ideas get tested, not just discussed.",
  },
  {
    index: "04",
    title: "PRODUCT DESIGN",
    description:
      "UX, interaction, structure and visual systems that make products feel intentional.",
  },
];

export const processSteps = [
  { index: "01", title: "DISCOVER", text: "Find the actual problem." },
  { index: "02", title: "DESIGN", text: "Turn complexity into a clear experience." },
  { index: "03", title: "BUILD", text: "Prototype and develop." },
  { index: "04", title: "TEST", text: "Break it, refine it, improve it." },
  { index: "05", title: "SHIP", text: "Deploy, learn and iterate." },
];

/* ── Editable profile shape (CMS-backed) ────── */
export type SiteProfile = {
  displayName: string;
  headline: string;
  heroDescription: string;
  availabilityStatus: string;
  location: string;
  aboutText: string;
  aboutTextSecondary: string;
  email: string; // plain address
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  contactCta: string;
  skills: StackGroup[];
};

export const fallbackProfile: SiteProfile = {
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
  skills: stackGroups,
};
