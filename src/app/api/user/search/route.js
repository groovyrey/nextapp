import { admin } from "/lib/firebase-admin.js";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ error: "Search query is required." }, { status: 400 });
    }

    const usersRef = admin.firestore().collection("users");
    const users = [];
    const queryLower = query.toLowerCase();

    const snapshot = await usersRef.get();
    snapshot.forEach(doc => {
      const data = doc.data();
      const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
      if (fullName.includes(queryLower)) {
        users.push({ id: doc.id, ...data });
      }
    });

    

    // Filter out sensitive data before sending to client
    const publicUsers = users.map((user) => {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePictureUrl: user.profilePictureUrl || null,
        authLevel: user.authLevel || 0, // Assuming authLevel is now directly in the user's Firestore document
      };
    });

    return NextResponse.json(publicUsers, { status: 200 });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json({ error: "Failed to search users." }, { status: 500 });
  }
}
