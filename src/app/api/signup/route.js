import { admin } from "/lib/firebase-admin.js";
import { NextResponse } from "next/server";
import { capitalizeName } from "../../../utils/capitalizeName";

export async function POST(request) {
  try {
    const { idToken, firstName, lastName, age } = await request.json();

    if (!firstName || !lastName || !age || isNaN(parseInt(age))) {
      return NextResponse.json({ error: "Missing or invalid user data." }, { status: 400 });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const capitalizedFirstName = capitalizeName(firstName);
    const capitalizedLastName = capitalizeName(lastName);

    await admin.firestore().collection("users").doc(uid).set({
      firstName: capitalizedFirstName,
      lastName: capitalizedLastName,
      age: parseInt(age),
      email: decodedToken.email,
    });

    return NextResponse.json({ message: "User data saved successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error saving user data:", error);
    return NextResponse.json({ error: "Failed to save user data." }, { status: 500 });
  }
}
