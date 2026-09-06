import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guard, jsonError } from "@/lib/admin-api";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

/* GET /api/admin/media — list assets */
export async function GET() {
  const { res } = await guard();
  if (res) return res;
  const assets = await db.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ assets });
}

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const MAX_DIMENSION = 1600;

/* POST /api/admin/media — upload (multipart form, field "file") */
export async function POST(req: NextRequest) {
  const { res } = await guard();
  if (res) return res;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError("Expected a multipart form upload.");
  }

  const file = form.get("file");
  if (!(file instanceof File)) return jsonError("No file provided.");
  if (!ALLOWED.includes(file.type)) {
    return jsonError("Unsupported format. Use JPG, PNG, WebP, GIF or AVIF.");
  }
  if (file.size > MAX_SIZE) {
    return jsonError("File is too large. Maximum is 8 MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  /* Optimize: raster types → normalized WebP; gif/avif pass through */
  let outBuffer: Uint8Array = new Uint8Array(buffer);
  let outMime = file.type;
  let ext = file.type === "image/gif" ? "gif" : file.type === "image/avif" ? "avif" : "webp";
  let width = 0;
  let height = 0;

  try {
    if (file.type === "image/gif" || file.type === "image/avif") {
      const meta = await sharp(buffer, { animated: file.type === "image/gif" }).metadata();
      width = meta.width ?? 0;
      height = meta.height ?? 0;
    } else {
      const webp = await sharp(buffer)
        .rotate()
        .resize({ width: MAX_DIMENSION, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer({ resolveWithObject: true });
      outBuffer = webp.data;
      outMime = "image/webp";
      ext = "webp";
      width = webp.info.width;
      height = webp.info.height;
    }
  } catch (error) {
    console.error("[media] processing failed:", error);
    return jsonError("Could not process this image.");
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  await writeFile(path.join(dir, filename), outBuffer);

  const url = `/uploads/${filename}`;
  const asset = await db.mediaAsset.create({
    data: {
      filename,
      originalName: file.name.slice(0, 200),
      url,
      mimeType: outMime,
      size: outBuffer.length,
      width,
      height,
    },
  });

  return NextResponse.json({ asset }, { status: 201 });
}
