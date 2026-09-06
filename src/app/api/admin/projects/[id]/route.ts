import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard, slugify, jsonError, projectUpdateSchema } from "@/lib/admin-api";

type Ctx = { params: Promise<{ id: string }> };

/* PATCH /api/admin/projects/[id] — update */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { res } = await guard();
  if (res) return res;
  const { id } = await ctx.params;

  const existing = await db.project.findUnique({ where: { id } });
  if (!existing) return jsonError("Project not found.", 404);

  const parsed = projectUpdateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid data.");
  }
  const data = parsed.data;

  if (data.slug || data.name) {
    const slug = slugify(data.slug || data.name!);
    const clash = await db.project.findFirst({ where: { slug, NOT: { id } } });
    if (clash) return jsonError("A project with this slug already exists.", 409);
    Object.assign(data, { slug });
  }

  const { screenshots, ...rest } = data;

  const project = await db.project.update({
    where: { id },
    data: {
      ...rest,
      ...(screenshots ? { screenshots: JSON.stringify(screenshots) } : {}),
    },
  });
  return NextResponse.json({ project });
}

/* DELETE /api/admin/projects/[id] */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { res } = await guard();
  if (res) return res;
  const { id } = await ctx.params;

  const existing = await db.project.findUnique({ where: { id } });
  if (!existing) return jsonError("Project not found.", 404);

  await db.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
