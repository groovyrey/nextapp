import { db } from '../../../../../lib/firebase.js';
import { NextResponse } from 'next/server';
import { doc, getDoc, collection } from "firebase/firestore";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const messageRef = doc(db, "maindata", id);
    const messageSnap = await getDoc(messageRef);

    if (!messageSnap.exists()) {
      return NextResponse.json({ message: 'Message not found' }, { status: 404 });
    }

    const messageData = messageSnap.data();
    return NextResponse.json({ id: messageSnap.id, ...messageData });
  } catch (error) {
    console.error("Error fetching message:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
