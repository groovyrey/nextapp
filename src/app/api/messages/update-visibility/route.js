import { NextResponse } from 'next/server';
import { auth, firestore } from '../../../../../lib/firebase-admin';

export async function POST(request) {
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authorization.split('Bearer ')[1];
    let decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userDoc = await firestore.collection('users').doc(uid).get();
    const userAuthLevel = userDoc.exists ? userDoc.data().authLevel || 0 : 0;

    if (userAuthLevel !== 1) {
      return NextResponse.json({ message: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    const { messageId, private: isPrivate } = await request.json();

    if (!messageId || typeof isPrivate === 'undefined') {
      return NextResponse.json({ message: 'Bad Request: messageId and private are required' }, { status: 400 });
    }

    const messageRef = firestore.collection('maindata').doc(messageId);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      return NextResponse.json({ message: 'Not Found: Message not found' }, { status: 404 });
    }

    await messageRef.update({ private: isPrivate });

    return NextResponse.json({ message: 'Message visibility updated successfully' });

  } catch (error) {
    console.error('Error updating message visibility:', error.message, error.stack);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
