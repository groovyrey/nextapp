import { admin, auth } from "/lib/firebase-admin.js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const userDoc = await admin.firestore().collection("users").doc(id).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const session = cookies().get("session")?.value || "";
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decodedClaims;
    try {
      decodedClaims = await auth.verifySessionCookie(session, true);
    } catch (error) {
      console.error("Error verifying session cookie:", error);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const queriedUserUid = userDoc.id;

    if (decodedClaims.uid !== queriedUserUid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userData = userDoc.data();
    const publicUserData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      age: userData.age,
    };

    return NextResponse.json(publicUserData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Failed to fetch user data." }, { status: 500 });
  }
}
