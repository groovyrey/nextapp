import { admin } from "/lib/firebase-admin.js";
import { NextResponse } from "next/server";
import { capitalizeName } from "../../utils/capitalizeName";
import { rateLimit } from '../../utils/rateLimit';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || request.ip;
  const limited = rateLimit(ip, 5, 60 * 1000); // 5 requests per minute

  if (!limited.allowed) {
    return NextResponse.json({ message: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    let idToken, firstName, lastName, age;
    try {
      ({ idToken, firstName, lastName, age } = await request.json());
    } catch (error) {
      console.error("Error parsing JSON for signup:", error);
      return NextResponse.json({ error: 'Invalid JSON in request body.' }, { status: 400 });
    }

    if (!firstName || !lastName || !age || isNaN(parseInt(age))) {
      return NextResponse.json({ error: "Missing or invalid user data." }, { status: 400 });
    }

    // Backend Validations
    const parsedAge = parseInt(age);
    if (firstName.length < 2 || firstName.length > 50 || !/^[a-zA-Z]+$/.test(firstName)) {
      return NextResponse.json({ error: "First name must be 2-50 alphabetic characters." }, { status: 400 });
    }
    if (lastName.length < 2 || lastName.length > 50 || !/^[a-zA-Z]+$/.test(lastName)) {
      return NextResponse.json({ error: "Last name must be 2-50 alphabetic characters." }, { status: 400 });
    }
    if (isNaN(parsedAge) || parsedAge < 13 || parsedAge > 120) {
      return NextResponse.json({ error: "Age must be a number between 13 and 120." }, { status: 400 });
    }
    // Email validation is handled by Firebase Auth, but we can add a basic check here if needed.
    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(decodedToken.email)) {
    //   return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    // }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const capitalizedFirstName = capitalizeName(firstName);
    const capitalizedLastName = capitalizeName(lastName);

    const firestore = admin.firestore();

    const userRef = firestore.collection("users").doc(uid);

    await userRef.set({
      firstName: capitalizedFirstName,
      lastName: capitalizedLastName,
      fullName: `${capitalizedFirstName} ${capitalizedLastName}`.toLowerCase(), // Add fullName field
      age: parseInt(age),
      email: decodedToken.email,
      authLevel: 0, // Default authLevel for new users
    });

    return NextResponse.json({ message: "User data saved successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error saving user data:", error);
    let errorMessage = "Failed to save user data.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
