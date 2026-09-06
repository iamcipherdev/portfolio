import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard, jsonError, reorderSchema } from "@/lib/admin-api";

/* POST /api/admin/projects/reorder — { ids: [...] } in display order */
export async function POST(req: NextRequest) {
  const { res } = await guard();
  if (res) return res;

  const parsed = reorderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("Invalid payload.");

  const tx = parsed.data.ids.map((id, index) =>
    db.project.update({ where: { id }, data: { displayOrder: index } })
  );
  await db.$transaction(tx);
  return NextResponse.json({ ok: true });
}
