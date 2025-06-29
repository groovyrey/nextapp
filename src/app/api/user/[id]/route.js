import { admin } from "/lib/firebase-admin.js";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const userDoc = await admin.firestore().collection("users").doc(id).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(userDoc.data(), { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Failed to fetch user data." }, { status: 500 });
  }
}
