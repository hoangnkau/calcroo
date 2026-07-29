import { NextResponse } from "next/server";
import { createSessionToken, COOKIE_NAME, MAX_AGE } from "@/lib/auth";

export async function POST(request) {
  const { password } = await request.json().catch(() => ({}));

  if (!password || password !== process.env.ABN_TRACKER_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "Incorrect password." },
      { status: 401 }
    );
  }

  const token = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
  return res;
}
