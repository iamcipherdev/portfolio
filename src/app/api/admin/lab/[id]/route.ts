import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard, jsonError, labUpdateSchema } from "@/lib/admin-api";

type Ctx = { params: Promise<{ id: string }> };

/* PATCH /api/admin/lab/[id] */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { res } = await guard();
  if (res) return res;
  const { id } = await ctx.params;

  const existing = await db.labExperiment.findUnique({ where: { id } });
  if (!existing) return jsonError("Experiment not found.", 404);

  const parsed = labUpdateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid data.");
  }
  const data = parsed.data;

  if (data.experimentId && data.experimentId !== existing.experimentId) {
    const taken = await db.labExperiment.findUnique({
      where: { experimentId: data.experimentId },
    });
    if (taken) return jsonError("This experiment ID is already in use.", 409);
  }

  const experiment = await db.labExperiment.update({ where: { id }, data });
  return NextResponse.json({ experiment });
}

/* DELETE /api/admin/lab/[id] */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { res } = await guard();
  if (res) return res;
  const { id } = await ctx.params;

  const existing = await db.labExperiment.findUnique({ where: { id } });
  if (!existing) return jsonError("Experiment not found.", 404);

  await db.labExperiment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
