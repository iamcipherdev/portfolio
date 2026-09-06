import Link from "next/link";
import { getAdminStats } from "@/lib/cms";
import { db } from "@/lib/db";
import { AdminHeader, AdminBadge } from "@/components/admin/bits";
import { ArrowUpRight, FolderKanban, FlaskConical, MessageSquareQuote, FileEdit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  let stats = {
    publishedProjects: 0,
    totalProjects: 0,
    publishedLab: 0,
    totalLab: 0,
    publishedTestimonials: 0,
    totalTestimonials: 0,
    drafts: 0,
  };
  let recent: { id: string; name: string; sub: string; published: boolean }[] = [];

  try {
    stats = await getAdminStats();
    const projects = await db.project.findMany({
      orderBy: [{ displayOrder: "asc" }],
      take: 4,
    });
    recent = projects.map((p) => ({
      id: p.id,
      name: p.name,
      sub: `${p.projectNumber || "—"} · ${p.year || p.status}`,
      published: p.published,
    }));
  } catch (e) {
    console.error("[admin overview]", e);
  }

  const cards = [
    {
      label: "Published Projects",
      value: stats.publishedProjects,
      sub: `${stats.totalProjects} total`,
      icon: FolderKanban,
      href: "/admin/projects",
    },
    {
      label: "Lab Experiments",
      value: stats.publishedLab,
      sub: `${stats.totalLab} total`,
      icon: FlaskConical,
      href: "/admin/lab",
    },
    {
      label: "Testimonials",
      value: stats.publishedTestimonials,
      sub: `${stats.totalTestimonials} total`,
      icon: MessageSquareQuote,
      href: "/admin/testimonials",
    },
    {
      label: "Drafts",
      value: stats.drafts,
      sub: "unpublished items",
      icon: FileEdit,
      href: "/admin/projects",
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Overview"
        subtitle="Everything the public portfolio shows is managed here — projects, lab experiments, testimonials and profile content."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-2xl border border-[#11111114] bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-28px_rgba(17,17,17,0.3)]"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F3EE] text-[#111111] transition-colors group-hover:bg-[#4D6BFF] group-hover:text-white">
                  <Icon className="h-4.5 w-4.5" aria-hidden />
                </span>
                <ArrowUpRight
                  className="h-4 w-4 text-[#aaaaaa] transition-all duration-300 group-hover:rotate-45 group-hover:text-[#4D6BFF]"
                  aria-hidden
                />
              </div>
              <p className="h-editorial mt-6 text-[2.4rem] leading-none tracking-[-0.03em]">
                {String(card.value).padStart(2, "0")}
              </p>
              <p className="mt-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#555555]">
                {card.label}
              </p>
              <p className="mt-1 text-[11px] text-[#999999]">{card.sub}</p>
            </Link>
          );
        })}
      </div>

      {/* recent projects */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#555555]">
            Project order
          </h2>
          <Link
            href="/admin/projects"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#4D6BFF] transition-colors hover:text-[#111111]"
          >
            Manage →
          </Link>
        </div>
        <div className="divide-y divide-[#1111110f] overflow-hidden rounded-2xl border border-[#11111114] bg-white">
          {recent.length ? (
            recent.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium">{r.name}</p>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#999999]">
                    {r.sub}
                  </p>
                </div>
                <AdminBadge label={r.published ? "PUBLISHED" : "DRAFT"} />
              </div>
            ))
          ) : (
            <p className="px-5 py-8 text-center text-[13px] text-[#777777]">
              No projects yet — create your first one.
            </p>
          )}
        </div>
      </div>

      {/* how it works */}
      <div className="mt-10 rounded-2xl border border-[#11111114] bg-white p-6 sm:p-8">
        <h2 className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#555555]">
          How this works
        </h2>
        <ul className="mt-4 space-y-3 text-[13.5px] leading-relaxed text-[#555555]">
          <li className="flex gap-3">
            <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rotate-45 bg-[#4D6BFF]" aria-hidden />
            Every change you save here is stored in the portfolio database and shown on the public site immediately — no code, no redeploy.
          </li>
          <li className="flex gap-3">
            <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rotate-45 bg-[#4D6BFF]" aria-hidden />
            Upload images once in <Link href="/admin/media" className="link-underline text-[#111111]">Media</Link>, reuse them across projects, lab entries and testimonials.
          </li>
          <li className="flex gap-3">
            <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rotate-45 bg-[#4D6BFF]" aria-hidden />
            The current testimonials are <AdminBadge label="RECONSTRUCTED" className="mx-1 align-middle" /> samples — replace each one with a genuine quote and mark it <AdminBadge label="VERIFIED" className="mx-1 align-middle" />.
          </li>
        </ul>
      </div>
    </div>
  );
}
