import { admin } from "/lib/firebase-admin.js";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { uid, firstName, lastName, age, authLevel } = await request.json();

    if (!uid || !firstName || !lastName || !age || isNaN(parseInt(age))) {
      return NextResponse.json({ error: "Missing or invalid user data." }, { status: 400 });
    }

    await admin.firestore().collection("users").doc(uid).update({
      firstName,
      lastName,
      age: parseInt(age),
    });

    if (authLevel !== undefined) {
      await admin.auth().setCustomUserClaims(uid, { authLevel: parseInt(authLevel) });
    }

    return NextResponse.json({ message: "User data updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json({ error: "Failed to update user data." }, { status: 500 });
  }
}
