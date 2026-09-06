import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard, slugify, jsonError, labSchema } from "@/lib/admin-api";

/* GET /api/admin/lab */
export async function GET() {
  const { res } = await guard();
  if (res) return res;
  const experiments = await db.labExperiment.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ experiments });
}

/* POST /api/admin/lab — create */
export async function POST(req: NextRequest) {
  const { res } = await guard();
  if (res) return res;

  const parsed = labSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid data.");
  }
  const data = parsed.data;

  let experimentId = data.experimentId;
  if (!experimentId) {
    const count = await db.labExperiment.count();
    // Suggest next free id
    let n = count + 1;
    while (true) {
      const candidate = `LAB_${String(n).padStart(3, "0")}`;
      const taken = await db.labExperiment.findUnique({
        where: { experimentId: candidate },
      });
      if (!taken) {
        experimentId = candidate;
        break;
      }
      n++;
    }
  } else {
    const taken = await db.labExperiment.findUnique({
      where: { experimentId },
    });
    if (taken) return jsonError("This experiment ID is already in use.", 409);
  }

  const maxOrder = await db.labExperiment.aggregate({ _max: { displayOrder: true } });
  const experiment = await db.labExperiment.create({
    data: {
      ...data,
      experimentId: experimentId!,
      displayOrder: (maxOrder._max.displayOrder ?? -1) + 1,
    },
  });
  return NextResponse.json({ experiment }, { status: 201 });
}
