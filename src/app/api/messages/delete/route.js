import { admin, auth, firestore } from '/lib/firebase-admin';

export async function POST(req) {
  try {
    const { messageId } = await req.json();
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];

    if (!idToken) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userDoc = await firestore.collection('users').doc(uid).get();
    const userAuthLevel = userDoc.exists ? userDoc.data().authLevel || 0 : 0;

    if (userAuthLevel !== 1) {
      return new Response(JSON.stringify({ message: 'Forbidden: Insufficient authorization' }), { status: 403 });
    }

    const db = admin.firestore();
    const messageRef = db.collection('maindata').doc(messageId);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      return new Response(JSON.stringify({ message: 'Not Found: Message not found' }), { status: 404 });
    }

    await messageRef.delete();

    return new Response(JSON.stringify({ message: 'Message deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting message:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}