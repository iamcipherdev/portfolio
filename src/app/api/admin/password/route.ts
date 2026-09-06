import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard, jsonError, passwordSchema } from "@/lib/admin-api";
import { verifyPassword, hashPassword } from "@/lib/auth";

/* POST /api/admin/password — change the admin password */
export async function POST(req: NextRequest) {
  const { session, res } = await guard();
  if (res) return res;

  const parsed = passwordSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid data.");
  }

  const admin = await db.adminUser.findUnique({ where: { username: session!.u } });
  if (!admin) return jsonError("Admin account not found.", 404);

  if (!verifyPassword(parsed.data.current, admin.passwordHash)) {
    return jsonError("Current password is incorrect.", 403);
  }

  await db.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash: hashPassword(parsed.data.next) },
  });
  return NextResponse.json({ ok: true });
}
