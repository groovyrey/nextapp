import { admin } from "/lib/firebase-admin.js";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { idToken, firstName, lastName, age } = await request.json();
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    await admin.firestore().collection("users").doc(uid).set({
      firstName,
      lastName,
      age,
      email: decodedToken.email,
    });

    return NextResponse.json({ message: "User data saved successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error saving user data:", error);
    return NextResponse.json({ error: "Failed to save user data." }, { status: 500 });
  }
}
