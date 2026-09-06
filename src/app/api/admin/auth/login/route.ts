import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  verifyPassword,
  createSessionToken,
  sessionCookieOptions,
  loginRateLimited,
  SESSION_COOKIE,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const username = String(body?.username ?? "").trim();
    const password = String(body?.password ?? "");

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    if (loginRateLimited(username.toLowerCase())) {
      return NextResponse.json(
        { error: "Too many attempts. Wait a minute and try again." },
        { status: 429 }
      );
    }

    const admin = await db.adminUser.findUnique({ where: { username } });
    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const token = await createSessionToken(admin.username);
    const res = NextResponse.json({ ok: true, username: admin.username });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (error) {
    console.error("[login]", error);
    return NextResponse.json({ error: "Login failed. Try again." }, { status: 500 });
  }
}
