import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard, slugify, jsonError, projectSchema } from "@/lib/admin-api";

/* GET /api/admin/projects — full list (incl. unpublished), ordered */
export async function GET() {
  const { res } = await guard();
  if (res) return res;
  const projects = await db.project.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ projects });
}

/* POST /api/admin/projects — create */
export async function POST(req: NextRequest) {
  const { res } = await guard();
  if (res) return res;

  const parsed = projectSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid data.");
  }
  const data = parsed.data;

  const slug = slugify(data.slug || data.name);
  const exists = await db.project.findUnique({ where: { slug } });
  if (exists) return jsonError("A project with this slug already exists.", 409);

  let projectNumber = data.projectNumber;
  if (!projectNumber) {
    const count = await db.project.count();
    projectNumber = String(count + 1).padStart(2, "0");
  }
  const maxOrder = await db.project.aggregate({ _max: { displayOrder: true } });

  const project = await db.project.create({
    data: {
      ...data,
      slug,
      projectNumber,
      displayOrder: (maxOrder._max.displayOrder ?? -1) + 1,
      screenshots: JSON.stringify(data.screenshots ?? []),
    },
  });
  return NextResponse.json({ project }, { status: 201 });
}
