import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard, jsonError, profileSchema } from "@/lib/admin-api";

/* GET /api/admin/profile */
export async function GET() {
  const { res } = await guard();
  if (res) return res;
  const profile = await db.profile.findUnique({ where: { id: "main" } });
  return NextResponse.json({ profile });
}

/* PATCH /api/admin/profile */
export async function PATCH(req: NextRequest) {
  const { res } = await guard();
  if (res) return res;

  const parsed = profileSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid data.");
  }

  // Validate skills JSON
  try {
    const skills = JSON.parse(parsed.data.skills);
    if (!Array.isArray(skills)) throw new Error("not array");
  } catch {
    return jsonError("Skills must be valid JSON (a list of groups).");
  }

  const profile = await db.profile.upsert({
    where: { id: "main" },
    update: parsed.data,
    create: { id: "main", ...parsed.data },
  });
  return NextResponse.json({ profile });
}
