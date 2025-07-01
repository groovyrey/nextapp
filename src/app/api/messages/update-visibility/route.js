import { NextResponse } from 'next/server';
import { auth } from '../../../lib/firebase-admin'; // Assuming firebase-admin is set up for auth

export async function POST(request) {
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authorization.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (error) {
      console.error('Error verifying ID token:', error);
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Check if the user has the necessary authorization level (e.g., admin)
    if (decodedToken.authLevel !== 1) { // Assuming authLevel 1 is admin
      return NextResponse.json({ message: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const { messageId, isVisible } = await request.json();

    if (!messageId || typeof isVisible === 'undefined') {
      return NextResponse.json({ message: 'Bad Request: messageId and isVisible are required' }, { status: 400 });
    }

    // In a real application, you would update the message's visibility in your database here.
    // For demonstration, we'll just log the action.
    console.log(`Message ${messageId} visibility updated to ${isVisible}`);

    return NextResponse.json({ message: 'Message visibility updated successfully' });

  } catch (error) {
    console.error('Error updating message visibility:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
