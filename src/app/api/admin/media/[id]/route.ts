import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard, jsonError } from "@/lib/admin-api";

type Ctx = { params: Promise<{ id: string }> };

/* DELETE /api/admin/media/[id] — refuses when asset is referenced */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { res } = await guard();
  if (res) return res;
  const { id } = await ctx.params;

  const asset = await db.mediaAsset.findUnique({ where: { id } });
  if (!asset) return jsonError("Asset not found.", 404);

  /* Safe-delete: refuse if referenced by content */
  const [projects, labs, testimonials] = await Promise.all([
    db.project.findMany(),
    db.labExperiment.findMany(),
    db.testimonial.findMany(),
  ]);

  const url = asset.url;
  const referenced =
    projects.some(
      (p) =>
        p.coverImage === url ||
        p.coverImageSm === url ||
        p.screenshots.includes(url)
    ) ||
    labs.some((l) => l.coverVisual === url) ||
    testimonials.some((t) => t.avatar === url);

  if (referenced) {
    return jsonError(
      "This asset is used by portfolio content. Remove it there first.",
      409
    );
  }

  await db.mediaAsset.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
