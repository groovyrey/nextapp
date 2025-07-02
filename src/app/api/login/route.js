
import { auth } from "/lib/firebase-admin.js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { idToken } = await request.json();

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

  (await cookies()).set("session", sessionCookie, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
  });

  return NextResponse.json({ status: "success" });
}
