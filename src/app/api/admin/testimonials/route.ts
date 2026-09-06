import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard, jsonError, testimonialSchema } from "@/lib/admin-api";

/* GET /api/admin/testimonials */
export async function GET() {
  const { res } = await guard();
  if (res) return res;
  const testimonials = await db.testimonial.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ testimonials });
}

/* POST /api/admin/testimonials */
export async function POST(req: NextRequest) {
  const { res } = await guard();
  if (res) return res;

  const parsed = testimonialSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid data.");
  }

  const maxOrder = await db.testimonial.aggregate({ _max: { displayOrder: true } });
  const testimonial = await db.testimonial.create({
    data: {
      ...parsed.data,
      displayOrder: (maxOrder._max.displayOrder ?? -1) + 1,
    },
  });
  return NextResponse.json({ testimonial }, { status: 201 });
}
