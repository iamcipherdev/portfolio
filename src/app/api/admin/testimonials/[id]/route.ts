import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard, jsonError, testimonialUpdateSchema } from "@/lib/admin-api";

type Ctx = { params: Promise<{ id: string }> };

/* PATCH /api/admin/testimonials/[id] */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { res } = await guard();
  if (res) return res;
  const { id } = await ctx.params;

  const existing = await db.testimonial.findUnique({ where: { id } });
  if (!existing) return jsonError("Testimonial not found.", 404);

  const parsed = testimonialUpdateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid data.");
  }

  const testimonial = await db.testimonial.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ testimonial });
}

/* DELETE /api/admin/testimonials/[id] */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { res } = await guard();
  if (res) return res;
  const { id } = await ctx.params;

  const existing = await db.testimonial.findUnique({ where: { id } });
  if (!existing) return jsonError("Testimonial not found.", 404);

  await db.testimonial.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
