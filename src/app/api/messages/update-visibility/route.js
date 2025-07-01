import { NextResponse } from 'next/server';
import { auth, firestore } from '../../../../../lib/firebase-admin';

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

    if (decodedToken.authLevel !== 1) {
      return NextResponse.json({ message: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const { messageId, private: isPrivate } = await request.json();

    if (!messageId || typeof isPrivate === 'undefined') {
      return NextResponse.json({ message: 'Bad Request: messageId and private are required' }, { status: 400 });
    }

    const messageRef = firestore.collection('messages').doc(messageId);
    await messageRef.update({ private: isPrivate });

    return NextResponse.json({ message: 'Message visibility updated successfully' });

  } catch (error) {
    console.error('Error updating message visibility:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
