import { db } from '../../../../../lib/firebase.js';
import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
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

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { message, sender } = await request.json();

    const messageRef = doc(db, "maindata", id);
    await updateDoc(messageRef, { message, sender });

    return NextResponse.json({ message: 'Message updated successfully' });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}