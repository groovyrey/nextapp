
import { auth } from "/lib/firebase-admin.js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = cookies().get("session")?.value || "";

  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(session, true);
    return NextResponse.json({ isLogged: true, decodedClaims });
  } catch (error) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }
}
