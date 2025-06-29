import { admin } from "/lib/firebase-admin.js";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const userDoc = await admin.firestore().collection("users").doc(id).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // IMPORTANT: Implement authentication and authorization here to ensure only authorized users can access this data.
    // For example, check if the requesting user has permission to view this user's profile.

    const userData = userDoc.data();
    // Filter out any sensitive data that should not be exposed to the client
    const publicUserData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      age: userData.age,
      // Add other public fields as needed
    };

    return NextResponse.json(publicUserData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Failed to fetch user data." }, { status: 500 });
  }
}
