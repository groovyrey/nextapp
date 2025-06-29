
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "/lib/firebase-admin.js";

export async function GET(request) {
  const sessionCookie = cookies().get("session")?.value || "";
  cookies().delete("session");

  try {
    // Revoke the Firebase session
    await auth.revokeRefreshTokens(sessionCookie);
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error revoking Firebase session:", error);
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
