export const site = {
  name: "CIPHER",
  role: "AI × WEB DEVELOPER",
  statement: "I build useful digital products with AI & the web.",
  basedIn: "PAKISTAN",
  year: "2026",
  /* Replace with your real links before going live */
  email: "mailto:hello@cipher.build",
  github: "https://github.com/cipher",
  linkedin: "https://www.linkedin.com/in/cipher",
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
];

export const labEntries = [
  {
    index: "01",
    name: "RECUROO",
    note: "WhatsApp-first ordering for cafés — iterating on the loyalty loop.",
    status: "LIVE",
    tone: "live" as const,
    year: "2026",
  },
  {
    index: "02",
    name: "HEARTSYNC",
    note: "Real-time mini-games for long-distance couples. No sign-up, no downloads.",
    status: "LIVE",
    tone: "live" as const,
    year: "2026",
  },
  {
    index: "03",
    name: "QURAN GUARD",
    note: "Browser extension for safer, more intentional browsing.",
    status: "BUILDING",
    tone: "building" as const,
    year: "2026",
  },
  {
    index: "04",
    name: "WOH KHAT",
    note: "An interactive writing experiment for words left unsaid.",
    status: "LIVE",
    tone: "live" as const,
    year: "2025",
  },
  {
    index: "05",
    name: "CAMPUSLIFT",
    note: "Campus mobility concept — exploring real ride-sharing needs.",
    status: "EXPERIMENT",
    tone: "experiment" as const,
    year: "2025",
  },
  {
    index: "06",
    name: "CIPHER.PORTFOLIO",
    note: "The site you're on — designed & built from scratch.",
    status: "SHIPPED",
    tone: "live" as const,
    year: "2026",
  },
];

export const stackGroups = [
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
