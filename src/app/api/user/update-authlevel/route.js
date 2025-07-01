import { admin } from "/lib/firebase-admin.js";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { uid, authLevel } = await request.json();

    if (!uid || authLevel === undefined || isNaN(parseInt(authLevel))) {
      return NextResponse.json({ error: "Missing or invalid user ID or auth level." }, { status: 400 });
    }

    await admin.auth().setCustomUserClaims(uid, { authLevel: parseInt(authLevel) });

    return NextResponse.json({ message: "User auth level updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error updating user auth level:", error);
    return NextResponse.json({ error: "Failed to update user auth level." }, { status: 500 });
  }
}
