import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

/* GET /api/media/[id] — serve a stored image straight from the database.
   Public, cacheable, works on any host (Vercel included — no disk involved). */
export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const asset = await db.mediaAsset.findUnique({
    where: { id },
    select: { mimeType: true, data: true },
  });
  if (!asset?.data) return new NextResponse("Not found", { status: 404 });

  const bytes = Buffer.from(asset.data, "base64");
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": asset.mimeType,
      "Content-Length": String(bytes.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
